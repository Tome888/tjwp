"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react"
import { ArrowUpRight } from "@phosphor-icons/react"
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
  gallery?: Array<{ src: string; caption: string }>
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

/** Phone screens side by side; swipe or scroll sideways. */
function Shots({ items, label }: { items: NonNullable<CardItem["gallery"]>; label: string }) {
  return (
    <ul className="shots" aria-label={label}>
      {items.map((shot, i) => (
        <li key={shot.src} className="shot" style={{ "--i": Math.min(i, 5) } as Vars}>
          <figure>
            <Image
              src={shot.src}
              alt={shot.caption}
              width={720}
              height={1564}
              sizes="236px"
              loading={i < 3 ? "eager" : "lazy"}
            />
            <figcaption aria-hidden="true">{shot.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
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
  const gallery = shown?.gallery?.length ? shown.gallery : null
  return (
    <Sheet
      open={!!project}
      onClose={onClose}
      labelledBy="sheet-title"
      closeLabel={t.close}
      media={
        shown && !gallery ? (
          <ProjectImage src={shown.image} title={shown.title} sizes="(min-width: 768px) 880px, 100vw" />
        ) : null
      }
      top={gallery ? <Shots items={gallery} label={t.screens} /> : null}
    >
      {shown ? (
        <div className="sheet__body">
          {shown.role || shown.status ? (
            <p className="sheet__meta">
              {shown.role ? <span>{shown.role}</span> : null}
              {shown.status ? <span className="status">{shown.status}</span> : null}
            </p>
          ) : null}
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
              {t.similar}
            </Link>
          </div>
        </div>
      ) : null}
    </Sheet>
  )
}

/** Home page: large rows, image on the left, words on the right. */
export function FeaturedWork({ items, t }: { items: CardItem[]; t: T }) {
  const { active, shown, open, close } = useProjectSheet(items, false)
  return (
    <>
      <ul className="entries">
        {items.map((item, i) => (
          <li key={item.slug} className="entry" data-reveal>
            <button type="button" className="entry__btn" aria-haspopup="dialog" onClick={() => open(item)}>
              <span className="entry__media">
                <ProjectImage
                  src={item.image}
                  title={item.title}
                  sizes="(min-width: 768px) 720px, 100vw"
                  priority={i === 0}
                />
              </span>
              <span className="entry__text">
                {item.role ? <span className="entry__role">{item.role}</span> : null}
                <span className="entry__title">{item.title}</span>
                <span className="entry__summary">{item.summary}</span>
                {item.status ? <span className="status">{item.status}</span> : null}
                <span className="entry__open">
                  {item.gallery?.length ? t.openScreens : t.open}
                </span>
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
      <div role="group" aria-label={t.filterLabel} className="filters">
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
        <ul className="tiles">
          {list.map((item, i) => (
            <li key={item.slug} id={item.slug} className="tile" data-reveal style={{ "--d": i % 3 } as Vars}>
              <button type="button" className="tile__btn" aria-haspopup="dialog" onClick={() => open(item)}>
                <span className="tile__media">
                  <ProjectImage
                    src={item.image}
                    title={item.title}
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  />
                </span>
                <span className="tile__body">
                  {item.role ? <span className="entry__role">{item.role}</span> : null}
                  <span className="tile__title">{item.title}</span>
                  <span className="callout">{item.summary}</span>
                  {item.status ? <span className="status">{item.status}</span> : null}
                  <span className="tags">
                    {item.tags.map((tg) => (
                      <span key={tg} className="tag">
                        {tg}
                      </span>
                    ))}
                  </span>
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
