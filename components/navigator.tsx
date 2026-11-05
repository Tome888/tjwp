"use client"

import Link from "next/link"
import { useEffect, useRef, type CSSProperties } from "react"
import { ArrowRight, X } from "@phosphor-icons/react"
import type { Dict } from "@/i18n/en"
import type { PageSection } from "@/lib/sections"
import { Logo } from "@/components/logo"

type Nav = Dict["nav"]
type Vars = CSSProperties & Record<`--${string}`, string | number>

export interface NavPage {
  href: string
  label: string
}

/**
 * The menu: the pages, and the sections of the page you're on. Nothing else
 * (language and theme live in the bar, motion in the footer). Opens with the
 * menu button or ⌘K / Ctrl+K / "/", growing out of the button that was pressed.
 */
export function Navigator({
  open,
  origin,
  onClose,
  t,
  name,
  pages,
  isActive,
  sections,
}: {
  open: boolean
  origin: { x: number; y: number } | null
  onClose: () => void
  t: Nav
  name: string
  pages: NavPage[]
  isActive: (href: string) => boolean
  sections: PageSection[]
}) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(id)
  }, [open])

  const calm = () => document.documentElement.dataset.motion === "reduced"
  const later = (fn: () => void) => window.setTimeout(fn, 40) // after the scroll lock lifts

  const style = (origin ? { "--ox": `${origin.x}px`, "--oy": `${origin.y}px` } : {}) as Vars
  const present = open ? sections.filter((s) => document.getElementById(s.id)) : sections

  return (
    <div
      id="navigator"
      ref={panel}
      className="navi"
      role="dialog"
      aria-modal="true"
      aria-label={t.label}
      tabIndex={-1}
      data-open={open ? "" : undefined}
      inert={!open}
      style={style}
    >
      <div className="navi__scroll">
        <div className="wrap">
          <div className="navi__top">
            <Link href="/" className="brand" onClick={onClose} aria-label={`${name}, ${t.home}`}>
              <Logo className="brand__mark" />
              <span className="brand__clip" aria-hidden="true">
                <span className="brand__name">{name}</span>
              </span>
            </Link>
            <button type="button" className="icon-btn navi__close" aria-label={t.close} onClick={onClose}>
              <X weight="bold" aria-hidden="true" />
            </button>
          </div>

          <div className="navi__grid">
            <nav aria-label={t.pages}>
              <span className="navi__label">{t.pages}</span>
              <ol className="navi__pages">
                {pages.map((page, i) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="navi__page"
                      style={{ "--i": i } as Vars}
                      aria-current={isActive(page.href) ? "page" : undefined}
                      onClick={(e) => {
                        onClose()
                        if (!isActive(page.href)) return
                        e.preventDefault()
                        later(() => window.scrollTo({ top: 0, behavior: calm() ? "auto" : "smooth" }))
                      }}
                    >
                      <span className="navi__num" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {page.label}
                      <ArrowRight weight="bold" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            {present.length ? (
              <nav aria-label={t.onThisPage} className="navi__side">
                <span className="navi__label">{t.onThisPage}</span>
                <ol className="navi__sections">
                  {present.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          onClose()
                          later(() =>
                            document
                              .getElementById(s.id)
                              ?.scrollIntoView({ behavior: calm() ? "auto" : "smooth", block: "start" }),
                          )
                        }}
                      >
                        <span className="navi__num" aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
