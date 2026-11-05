"use client"

import { useEffect, useState } from "react"
import type { PageSection } from "@/lib/sections"

/**
 * A slim index on the right edge of the home page (wide screens only):
 * one tick per section, the current one long and orange. Hover shows the
 * name; click goes there.
 */
export function SectionRail({ sections, label }: { sections: PageSection[]; label: string }) {
  const [current, setCurrent] = useState(sections[0]?.id)

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el)
    // A section is current while it crosses the middle band of the screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [sections])

  const go = (id: string) => {
    const calm = document.documentElement.dataset.motion === "reduced"
    document.getElementById(id)?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" })
  }

  return (
    <nav className="rail" aria-label={label}>
      <ol>
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={current === s.id ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault()
                go(s.id)
              }}
            >
              <span className="rail__label">{s.label}</span>
              <span className="rail__tick" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
