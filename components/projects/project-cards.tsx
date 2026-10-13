"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react"
import { ArrowUpRight, ChatCircleDots } from "@phosphor-icons/react"
import type { Dict } from "@/i18n/en"
import { ProjectImage } from "@/components/project-image"
import { Sheet } from "@/components/ui/sheet"

export interface CardItem {
  slug: string
  title: string
  summary: string
  details: string
  tags: string[]
  role?: string
  status?: string
  link?: string
  image?: string
}

type T = Dict["projects"]
type Vars = CSSProperties & Record<`--${string}`, string | number>

/** Opens one project in a sheet; keeps showing it while the sheet slides away. */
function useProjectSheet(items: CardItem[], deepLink: boolean) {
  const [active, setActive] = useState<CardItem | null>(null)
  const [shown, setShown] = useState<CardItem | null>(null)

  const open = useCallback(
    (item: CardItem) => {
      setShown(item)
      setActive(item)
      if (deepLink) history.replaceState(null, "", `#${item.slug}`)
    },
    [deepLink],
  )

  const close = useCallback(() => {
    setActive(null)
    if (deepLink && location.hash) history.replaceState(null, "", location.pathname + location.search)
  }, [deepLink])

  // Links like /projects#pabau-software open that project directly.
  useEffect(() => {
    if (!deepLink) return
    const fromHash = () => {
      const slug = decodeURIComponent(location.hash.slice(1))
      const hit = items.find((item) => item.slug === slug)
      if (hit) {
        setShown(hit)
        setActive(hit)
      }
    }
    fromHash()
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
  }, [items, deepLink])

  return { active, shown, open, close }
}

function ProjectSheet({
  project,
  shown,
  onClose,
  t,
}: {
  project: CardItem | null
  shown: CardItem | null
  onClose: () => void
  t: T
}) {
  return (
    <Sheet
      open={!!project}
      onClose={onClose}
      labelledBy="sheet-title"
      closeLabel={t.close}
      media={shown ? <ProjectImage src={shown.image} title={shown.title} sizes="(min-width: 768px) 760px, 100vw" /> : null}
    >
      {shown ? (
        <div className="sheet__body">
          <div className="flex flex-wrap items-center gap-2">
            {shown.role ? <span className="caps text-[var(--label-2)]">{shown.role}</span> : null}
            {shown.status ? <span className="badge">{shown.status}</span> : null}
          </div>
          <h2 id="sheet-title" className="sheet__title">
            {shown.title}
          </h2>
          <ul className="tags" aria-label={t.tags}>
            {shown.tags.map((tag) => (
              <li key={tag} className="tag">
                {tag}
              </li>
            ))}
          </ul>
          <p className="sheet__text">{shown.details}</p>
          <div className="sheet__actions">
            {shown.link ? (
              <a href={shown.link} target="_blank" rel="noopener noreferrer" className="btn btn--fill">
                {t.visit}
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </a>
            ) : null}
            <Link href="/contact?topic=project" className="btn btn--tinted">
              <ChatCircleDots weight="bold" aria-hidden="true" />
              {t.similar}
            </Link>
          </div>
        </div>
      ) : null}
    </Sheet>
  )
}

/** Home page: big image cards, like the App Store's Today tab. */
export function FeaturedWork({ items, t }: { items: CardItem[]; t: T }) {
  const { active, shown, open, close } = useProjectSheet(items, false)
  return (
    <>
      <ul className="pgrid">
        {items.map((item, i) => (
          <li key={item.slug} data-reveal style={{ "--d": i % 2 } as Vars}>
            <button type="button" className="pcard" aria-haspopup="dialog" onClick={() => open(item)}>
              <span className="pcard__media">
                <ProjectImage src={item.image} title={item.title} sizes="(min-width: 768px) 560px, 100vw" />
              </span>
              <span className="pcard__scrim" aria-hidden="true" />
              {item.status ? (
                <span className="pcard__top">
                  <span />
                  <span className="badge badge--on-dark">{item.status}</span>
                </span>
              ) : null}
              <span className="pcard__text">
                {item.role ? <span className="caps pcard__eyebrow block">{item.role}</span> : null}
                <span className="pcard__title block">{item.title}</span>
                <span className="pcard__summary block">{item.summary}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <ProjectSheet project={active} shown={shown} onClose={close} t={t} />
    </>
  )
}

/** Work page: every project, filterable by tag. */
export function ProjectIndex({ items, t }: { items: CardItem[]; t: T }) {
  const [tag, setTag] = useState("all")
  const { active, shown, open, close } = useProjectSheet(items, true)

  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of items) for (const tg of item.tags) counts.set(tg, (counts.get(tg) ?? 0) + 1)
    return Array.from(counts.entries())
  }, [items])

  const list = tag === "all" ? items : items.filter((item) => item.tags.includes(tag))

  return (
    <>
      <div role="group" aria-label={t.filterLabel} className="chips mb-5">
        <button type="button" className="chip" aria-pressed={tag === "all"} onClick={() => setTag("all")}>
          {t.all} <span className="chip__count">{items.length}</span>
        </button>
        {tags.map(([name, count]) => (
          <button key={name} type="button" className="chip" aria-pressed={tag === name} onClick={() => setTag(name)}>
            {name} <span className="chip__count">{count}</span>
          </button>
        ))}
      </div>

      {list.length ? (
        <ul key={tag} className="wgrid">
          {list.map((item, i) => (
            <li key={item.slug} id={item.slug} className="enter" style={{ "--d": Math.min(i, 6) } as Vars}>
              <button type="button" className="wcard" aria-haspopup="dialog" onClick={() => open(item)}>
                <span className="wcard__media">
                  <ProjectImage
                    src={item.image}
                    title={item.title}
                    sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"
                  />
                </span>
                <span className="wcard__body">
                  {item.role || item.status ? (
                    <span className="wcard__meta">
                      {item.role ? <span className="caps text-[var(--label-2)]">{item.role}</span> : null}
                      {item.status ? <span className="badge">{item.status}</span> : null}
                    </span>
                  ) : null}
                  <span className="title-3 block">{item.title}</span>
                  <span className="callout block">{item.summary}</span>
                  <span className="wcard__tags block">{item.tags.join(" · ")}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="callout py-16">{t.empty}</p>
      )}

      <ProjectSheet project={active} shown={shown} onClose={close} t={t} />
    </>
  )
}
