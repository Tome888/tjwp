"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react"
import type { Dict } from "@/i18n/en"
import { Arrow, Chars, Roll } from "@/components/motion/kinetic"
import { ProjectImage } from "@/components/project-image"

export interface IndexItem {
  slug: string
  number: string
  title: string
  summary: string
  details: string
  tags: string[]
  link?: string
  image?: string
}

type Vars = CSSProperties & Record<`--${string}`, string | number>

export function ProjectIndex({ items, t }: { items: IndexItem[]; t: Dict["projects"] }) {
  const [tag, setTag] = useState("all")
  const [active, setActive] = useState<IndexItem | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of items) for (const tg of item.tags) counts.set(tg, (counts.get(tg) ?? 0) + 1)
    return Array.from(counts.entries())
  }, [items])

  const list = tag === "all" ? items : items.filter((item) => item.tags.includes(tag))

  const open = useCallback((item: IndexItem) => {
    setActive(item)
    history.replaceState(null, "", `#${item.slug}`)
  }, [])

  // Links like /projects#pabau-software open that project directly.
  useEffect(() => {
    const fromHash = () => {
      const slug = decodeURIComponent(location.hash.slice(1))
      const hit = items.find((item) => item.slug === slug)
      if (hit) setActive(hit)
    }
    fromHash()
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
  }, [items])

  useEffect(() => {
    const el = dialog.current
    if (active && el && !el.open) el.showModal()
  }, [active])

  const onClose = () => {
    setActive(null)
    history.replaceState(null, "", location.pathname + location.search)
  }

  return (
    <>
      <div role="group" aria-label={t.filterLabel} className="filters">
        <button type="button" aria-pressed={tag === "all"} onClick={() => setTag("all")}>
          {t.all} <sup>{items.length}</sup>
        </button>
        {tags.map(([name, count]) => (
          <button key={name} type="button" aria-pressed={tag === name} onClick={() => setTag(name)}>
            {name} <sup>{count}</sup>
          </button>
        ))}
      </div>

      <Preview items={items}>
        {(hover) =>
          list.length ? (
            <ol key={tag} className="pi">
              {list.map((item, i) => (
                <li key={item.slug} id={item.slug} className="pi-row" style={{ "--d": Math.min(i, 8) } as Vars}>
                  <button
                    type="button"
                    className="pi-btn"
                    aria-haspopup="dialog"
                    onClick={() => open(item)}
                    onPointerEnter={() => hover(item.slug)}
                    onPointerLeave={() => hover(null)}
                  >
                    <span className="pi-thumb">
                      <ProjectImage src={item.image} title={item.title} sizes="(min-width: 768px) 1px, 92vw" />
                    </span>
                    <span className="pi-num label">{item.number}</span>
                    <span className="pi-title display">
                      <Chars text={item.title} by="word" />
                    </span>
                    <span className="pi-summary">{item.summary}</span>
                    <span className="pi-tags">{item.tags.join(" / ")}</span>
                    <span className="pi-arrow" aria-hidden="true">
                      <Arrow />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <p className="py-16 text-soft">{t.empty}</p>
          )
        }
      </Preview>

      <dialog
        ref={dialog}
        className="pd"
        aria-labelledby="pd-title"
        onClose={onClose}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        {active ? (
          <div className="pd__inner">
            <div className="pd__bar">
              <span className="label">
                {active.number} / {items.length.toString().padStart(2, "0")}
              </span>
              <button type="button" className="label-btn" onClick={() => dialog.current?.close()} autoFocus>
                {t.close}
              </button>
            </div>
            <div className="pd__media">
              <ProjectImage src={active.image} title={active.title} sizes="(min-width: 1024px) 64rem, 100vw" />
            </div>
            <div className="pd__body">
              <h2 id="pd-title" className="display pd__title">
                {active.title}
              </h2>
              <ul className="tags" aria-label={t.tags}>
                {active.tags.map((tg) => (
                  <li key={tg}>{tg}</li>
                ))}
              </ul>
              <p className="pd__text">{active.details}</p>
              <div className="pd__actions">
                {active.link ? (
                  <a href={active.link} target="_blank" rel="noopener noreferrer" className="btn btn--accent roll-host">
                    <Roll text={t.visit} arrow="out" />
                  </a>
                ) : null}
                <Link href="/contact?topic=project" className="link roll-host">
                  <Roll text={t.similar} arrow="right" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  )
}

/**
 * Desktop only: an image that follows the cursor over the list.
 * Images mount on first hover so they never cost anything on load.
 */
function Preview({
  items,
  children,
}: {
  items: IndexItem[]
  children: (hover: (slug: string | null) => void) => ReactNode
}) {
  const box = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [armed, setArmed] = useState(false)
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)")
    const sync = () => setEnabled(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = box.current
    if (!el) return
    const calm = document.documentElement.dataset.motion !== "full"
    let x = innerWidth / 2
    let y = innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0
    const tick = () => {
      x += (tx - x) * (calm ? 1 : 0.16)
      y += (ty - y) * (calm ? 1 : 0.16)
      el.style.transform = `translate3d(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0
    }
    const move = (e: PointerEvent) => {
      tx = e.clientX + 24
      ty = e.clientY
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener("pointermove", move, { passive: true })
    return () => {
      window.removeEventListener("pointermove", move)
      cancelAnimationFrame(raf)
    }
  }, [enabled, armed])

  const hover = useCallback(
    (slug: string | null) => {
      if (!enabled) return
      if (slug) setArmed(true)
      setCurrent(slug)
    },
    [enabled],
  )

  return (
    <>
      {children(hover)}
      {enabled && armed ? (
        <div ref={box} className="pi-preview" data-on={current ? "true" : "false"} aria-hidden="true">
          {items.map((item) => (
            <div key={item.slug} className="pi-preview__img" data-active={current === item.slug ? "true" : "false"}>
              <ProjectImage src={item.image} title={item.title} sizes="26rem" />
            </div>
          ))}
        </div>
      ) : null}
    </>
  )
}
