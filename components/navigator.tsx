"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { ArrowRight, ArrowUpRight, MagnifyingGlass, X } from "@phosphor-icons/react"
import type { Lang } from "@/content/types"
import type { Dict } from "@/i18n/en"
import type { PageSection } from "@/lib/sections"
import { Logo } from "@/components/logo"
import { ProjectImage } from "@/components/project-image"
import { setMotion, useMotionMode } from "@/components/motion/motion-toggle"

type Nav = Dict["nav"]
type Vars = CSSProperties & Record<`--${string}`, string | number>

export interface NavProject {
  slug: string
  title: string
  sub: string
  image?: string
  /** Lowercased text the search matches against (both languages, tags). */
  search: string
}

export interface NavPage {
  href: string
  label: string
}

/**
 * The navigator: every page, the sections of the current page, and a search
 * over all projects, in one full-screen panel. Opens from the bar (or with
 * ⌘K / Ctrl+K / "/"), growing out of the button that was pressed. Picking a
 * project goes straight to it on the Work page, already open.
 */
export function Navigator({
  open,
  origin,
  onClose,
  lang,
  t,
  name,
  pages,
  isActive,
  sections,
  projects,
  onLang,
  langPending,
  instant,
}: {
  open: boolean
  origin: { x: number; y: number } | null
  onClose: () => void
  lang: Lang
  t: Nav
  name: string
  pages: NavPage[]
  isActive: (href: string) => boolean
  sections: PageSection[]
  projects: NavProject[]
  onLang: (lang: Lang) => void
  langPending: boolean
  /** Show it already open, skipping the opening animation. */
  instant?: boolean
}) {
  const router = useRouter()
  const panel = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [present, setPresent] = useState<string[]>([])
  const { resolvedTheme, setTheme } = useTheme()
  const motion = useMotionMode()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === "dark"

  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (!words.length) return projects
    return projects.filter((p) => words.every((w) => p.search.includes(w)))
  }, [projects, query])

  useEffect(() => setActive(0), [query])

  // On open: focus the search on desktop (on phones that would pop the
  // keyboard over everything), and only list sections that exist.
  useEffect(() => {
    if (!open) return
    setPresent(sections.filter((s) => document.getElementById(s.id)).map((s) => s.id))
    const id = requestAnimationFrame(() => {
      if (matchMedia("(pointer: fine)").matches) input.current?.focus({ preventScroll: true })
      else panel.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(id)
  }, [open, sections])

  // Clear the search a moment after closing, once the panel is out of sight.
  useEffect(() => {
    if (open) return
    const id = window.setTimeout(() => setQuery(""), 700)
    return () => clearTimeout(id)
  }, [open])

  const calm = () => document.documentElement.dataset.motion === "reduced"

  const goToSection = (id: string) => {
    onClose()
    // Wait for the scroll lock to lift before scrolling.
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: calm() ? "auto" : "smooth", block: "start" })
    }, 40)
  }

  const openProject = (slug: string) => {
    onClose()
    if (isActive("/projects")) {
      if (location.hash === `#${slug}`) window.dispatchEvent(new HashChangeEvent("hashchange"))
      else location.hash = slug
    } else {
      router.push(`/projects#${slug}`)
    }
  }

  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      openProject(results[Math.min(active, results.length - 1)].slug)
    }
  }

  // Keep the highlighted result in view while moving with the arrow keys.
  useEffect(() => {
    if (!open) return
    document.getElementById(`navi-opt-${active}`)?.scrollIntoView({ block: "nearest" })
  }, [active, open])

  const style = (origin ? { "--ox": `${origin.x}px`, "--oy": `${origin.y}px` } : {}) as Vars
  const shownSections = sections.filter((s) => present.includes(s.id))

  return (
    <div
      id="navigator"
      ref={panel}
      className="navi"
      role="dialog"
      aria-modal="true"
      aria-label={t.navigator}
      tabIndex={-1}
      data-open={open ? "" : undefined}
      data-instant={instant ? "" : undefined}
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
                        if (isActive(page.href)) {
                          e.preventDefault()
                          onClose()
                          window.setTimeout(() => window.scrollTo({ top: 0, behavior: calm() ? "auto" : "smooth" }), 40)
                        } else onClose()
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

              {shownSections.length ? (
                <div className="mt-10">
                  <span className="navi__label">{t.onThisPage}</span>
                  <div className="navi__sections">
                    {shownSections.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className="chip"
                        onClick={(e) => {
                          e.preventDefault()
                          goToSection(s.id)
                        }}
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </nav>

            <div className="navi__side">
              <label className="navi__label" htmlFor="navi-search">
                {t.projectsLabel}
              </label>
              <div className="navi__search">
                <MagnifyingGlass weight="bold" aria-hidden="true" />
                <input
                  ref={input}
                  id="navi-search"
                  type="search"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="navi-results"
                  aria-activedescendant={results.length ? `navi-opt-${active}` : undefined}
                  aria-label={t.search}
                  placeholder={t.searchPlaceholder}
                  autoComplete="off"
                  spellCheck={false}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onSearchKey}
                />
              </div>

              {results.length ? (
                <ul id="navi-results" role="listbox" aria-label={t.projectsLabel} className="navi__results">
                  {results.map((p, i) => (
                    <li
                      key={p.slug}
                      id={`navi-opt-${i}`}
                      role="option"
                      aria-selected={i === active}
                      className="navi__result"
                      data-active={i === active ? "" : undefined}
                      onMouseMove={() => i !== active && setActive(i)}
                      onClick={() => openProject(p.slug)}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="navi__thumb">
                        <ProjectImage src={p.image} title={p.title} sizes="64px" />
                      </span>
                      <span className="navi__result-text">
                        <span className="navi__result-title">{p.title}</span>
                        <span className="navi__result-sub">{p.sub}</span>
                      </span>
                      <ArrowUpRight weight="bold" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              ) : (
                <p id="navi-results" className="navi__empty" role="status">
                  {t.noMatches}
                </p>
              )}
            </div>
          </div>

          <div className="navi__settings">
            <Seg
              label={t.language}
              options={[
                { key: "en", label: "EN", lang: "en" },
                { key: "mk", label: "МК", lang: "mk" },
              ]}
              value={lang}
              pending={langPending}
              onChange={(v) => onLang(v as Lang)}
            />
            <Seg
              label={t.theme}
              options={[
                { key: "light", label: t.themeLight },
                { key: "dark", label: t.themeDark },
              ]}
              value={mounted ? (dark ? "dark" : "light") : null}
              onChange={(v) => setTheme(v)}
            />
            <Seg
              label={t.motion}
              options={[
                { key: "full", label: t.motionFull },
                { key: "reduced", label: t.motionCalm },
              ]}
              value={motion}
              onChange={(v) => setMotion(v as "full" | "reduced")}
            />
            <p className="navi__hint">{t.hint}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Seg({
  label,
  options,
  value,
  pending,
  onChange,
}: {
  label: string
  options: Array<{ key: string; label: string; lang?: string }>
  value: string | null
  pending?: boolean
  onChange: (key: string) => void
}) {
  const id = useId()
  return (
    <div className="flex items-center" style={pending ? { opacity: 0.6 } : undefined}>
      <span className="seg__label" id={id}>
        {label}
      </span>
      <div role="group" aria-labelledby={id} className="seg">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            lang={o.lang}
            aria-pressed={value ? value === o.key : undefined}
            onClick={() => value !== o.key && onChange(o.key)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
