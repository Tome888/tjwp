"use client"

import { useCallback, useEffect, useRef, type PointerEvent, type ReactNode } from "react"
import { X } from "@phosphor-icons/react"

/**
 * An iOS-style sheet on a native <dialog>. On phones it springs up from the
 * bottom while the page behind it shrinks back, and can be swiped down to
 * close (from the top handle or the image). On wider screens it opens as a
 * centered card. Esc, the close button and a tap outside also close it.
 */
export function Sheet({
  open,
  onClose,
  labelledBy,
  closeLabel,
  media,
  children,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  closeLabel: string
  /** Shown at the top; dragging it also moves the sheet. */
  media?: ReactNode
  children: ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closing = useRef(0)

  const finish = useCallback(() => {
    const d = dialog.current
    if (d?.open) d.close()
  }, [])

  const requestClose = useCallback(() => {
    const d = dialog.current
    if (!d?.open || closing.current) return
    delete d.dataset.open
    delete d.dataset.dragging
    document.documentElement.classList.remove("sheet-open")
    const calm = document.documentElement.dataset.motion === "reduced"
    closing.current = window.setTimeout(
      () => {
        closing.current = 0
        finish()
      },
      calm ? 200 : 380,
    )
  }, [finish])

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) {
      if (closing.current) {
        clearTimeout(closing.current)
        closing.current = 0
      }
      const root = document.documentElement
      root.style.setProperty("--sheet-origin", `${window.scrollY + window.innerHeight * 0.4}px`)
      d.style.removeProperty("--drag")
      d.showModal()
      root.classList.add("sheet-open")
      requestAnimationFrame(() => requestAnimationFrame(() => (d.dataset.open = "")))
    } else if (!open && d.open) {
      requestClose()
    }
  }, [open, requestClose])

  useEffect(
    () => () => {
      document.documentElement.classList.remove("sheet-open")
      if (closing.current) clearTimeout(closing.current)
    },
    [],
  )

  // Swipe down to close.
  const drag = useRef<{ y: number; t: number; dy: number; id: number } | null>(null)
  const onPointerDown = (e: PointerEvent) => {
    const d = dialog.current
    if (!d || e.button !== 0 || window.innerWidth >= 768) return
    drag.current = { y: e.clientY, t: performance.now(), dy: 0, id: e.pointerId }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    d.dataset.dragging = ""
  }
  const onPointerMove = (e: PointerEvent) => {
    const d = dialog.current
    const s = drag.current
    if (!d || !s || s.id !== e.pointerId) return
    const raw = e.clientY - s.y
    // Follows the finger downwards; resists a little when pulled up.
    s.dy = raw > 0 ? raw : raw / 6
    d.style.setProperty("--drag", `${s.dy}px`)
  }
  const onPointerUp = (e: PointerEvent) => {
    const d = dialog.current
    const s = drag.current
    if (!d || !s || s.id !== e.pointerId) return
    drag.current = null
    const speed = s.dy / Math.max(1, performance.now() - s.t)
    delete d.dataset.dragging
    if (s.dy > 110 || (s.dy > 30 && speed > 0.5)) {
      requestClose()
    } else {
      d.style.setProperty("--drag", "0px")
    }
  }
  const dragProps = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  }

  return (
    <dialog
      ref={dialog}
      className="sheet"
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault()
        requestClose()
      }}
      onClose={() => {
        document.documentElement.classList.remove("sheet-open")
        onClose()
      }}
      onClick={(e) => e.target === dialog.current && requestClose()}
    >
      <div className="sheet__grab" aria-hidden="true" {...dragProps} />
      <button type="button" className="icon-btn sheet__close" aria-label={closeLabel} onClick={requestClose}>
        <X weight="bold" aria-hidden="true" />
      </button>
      <div className="sheet__scroll">
        {media ? (
          <div className="sheet__media" {...dragProps}>
            {media}
          </div>
        ) : null}
        {children}
      </div>
    </dialog>
  )
}
