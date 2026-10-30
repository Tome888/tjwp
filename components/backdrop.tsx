"use client"

import { useEffect, useRef } from "react"

/**
 * The page background: a faint dot grid, two soft glows that drift very
 * slowly, and on desktop a glow that trails the cursor. Everything moves
 * with transform only (no repaints), and it all sits still in Calm mode.
 */
export function Backdrop() {
  const spot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = spot.current
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches) return
    let frame = 0
    let x = 0
    let y = 0
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
        el.dataset.on = ""
      })
    }
    const leave = () => delete el.dataset.on
    window.addEventListener("pointermove", move, { passive: true })
    document.documentElement.addEventListener("pointerleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("pointerleave", leave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__dots" />
      <div className="backdrop__glow backdrop__glow--a" />
      <div className="backdrop__glow backdrop__glow--b" />
      <div ref={spot} className="backdrop__spot" />
    </div>
  )
}
