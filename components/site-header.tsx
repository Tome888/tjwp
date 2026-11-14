"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useRef, useState, useTransition, type MouseEvent } from "react"
import { Moon, Sun } from "@phosphor-icons/react"
import type { Lang } from "@/content/types"
import type { Dict } from "@/i18n/en"
import { Logo } from "@/components/logo"
import { Navigator } from "@/components/navigator"

type Nav = Dict["nav"]

const links: Array<{ href: string; key: "home" | "projects" | "about" | "contact" }> = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
]

export function SiteHeader({
  lang,
  t,
  firstName,
  lastName,
}: {
  lang: Lang
  t: Nav
  firstName: string
  lastName: string
}) {
  // On the server this is the internal path (/en/projects); in the browser
  // the visible one (/projects). Strip the language so both agree.
  const pathname = usePathname().replace(/^\/(en|mk)(?=\/|$)/, "") || "/"
  const name = `${firstName} ${lastName}`
  const scrolled = useScrolled()
  const header = useRef<HTMLElement>(null)
  const jumpBtn = useRef<HTMLButtonElement>(null)
  const lastTrigger = useRef<HTMLElement | null>(null)
  const [menu, setMenu] = useState(false)
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null)
  const { choose: chooseLang, pending: langPending } = useLangSwitch(lang)
  const [shortcut, setShortcut] = useState("⌘K")
  useEffect(() => {
    if (!/Mac|iPhone|iPad/i.test(navigator.userAgent)) setShortcut("Ctrl K")
  }, [])
  const isActive = useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)),
    [pathname],
  )

  /** Opens the navigator from an element (its circle grows out of it). */
  const openFrom = useCallback((el: HTMLElement | null) => {
    const r = el?.getBoundingClientRect()
    setOrigin(r && r.width ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: window.innerWidth - 40, y: 40 })
    lastTrigger.current = el
    setMenu(true)
  }, [])
  const close = useCallback(() => setMenu(false), [])

  // Close on navigation.
  useEffect(() => setMenu(false), [pathname])

  // ⌘K / Ctrl+K toggles; "/" opens (unless typing somewhere).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, select, [contenteditable='true']")
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        if (menu) setMenu(false)
        else openFrom(jumpBtn.current?.offsetParent ? jumpBtn.current : document.querySelector<HTMLElement>(".menu-btn"))
      } else if (e.key === "/" && !typing && !menu && !document.querySelector("dialog[open]")) {
        e.preventDefault()
        openFrom(jumpBtn.current?.offsetParent ? jumpBtn.current : document.querySelector<HTMLElement>(".menu-btn"))
      } else if (e.key === "Escape" && menu) {
        setMenu(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menu, openFrom])

  // While open: lock the page behind it, take it out of the tab order, and
  // hand focus back to the button afterwards.
  useEffect(() => {
    if (!menu) return
    const root = document.documentElement
    const page = document.getElementById("page")
    root.classList.add("menu-open")
    if (page) page.inert = true
    if (header.current) header.current.inert = true
    return () => {
      root.classList.remove("menu-open")
      if (page) page.inert = false
      if (header.current) header.current.inert = false
      lastTrigger.current?.focus({ preventScroll: true })
    }
  }, [menu])

  // Tapping the page you're already on scrolls back to the top.
  const onNav = (e: MouseEvent, href: string) => {
    if (!isActive(href)) return
    e.preventDefault()
    const calm = document.documentElement.dataset.motion === "reduced"
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" })
  }


  return (
    <>
      <header ref={header} className="topbar" data-scrolled={scrolled ? "" : undefined}>
        <div className="wrap">
          <div className="topbar__pill">
            <Link href="/" className="brand" aria-label={`${name}, ${t.home}`} onClick={(e) => onNav(e, "/")}>
              <Logo className="brand__mark" />
              {/* Slides in behind the logo once the page is scrolled. */}
              <span className="brand__clip" aria-hidden="true">
                <span className="brand__name">{name}</span>
              </span>
            </Link>

            <div className="tools">
              <button
                type="button"
                lang={lang === "en" ? "mk" : "en"}
                className="icon-btn"
                aria-label={t.switchLang}
                title={t.switchLang}
                data-pending={langPending || undefined}
                onClick={() => chooseLang(lang === "en" ? "mk" : "en")}
              >
                {lang === "en" ? "MK" : "EN"}
              </button>
              <ThemeToggle t={t} />
              <button
                ref={jumpBtn}
                type="button"
                className="jump-btn"
                aria-haspopup="dialog"
                aria-expanded={menu}
                aria-controls="navigator"
                onClick={(e) => openFrom(e.currentTarget)}
              >
                {t.menu}
                <kbd aria-hidden="true">{shortcut}</kbd>
              </button>
              <button
                type="button"
                className="icon-btn menu-btn"
                aria-haspopup="dialog"
                aria-expanded={menu}
                aria-controls="navigator"
                aria-label={t.menu}
                onClick={(e) => openFrom(e.currentTarget)}
              >
                <span className="menu-btn__lines" aria-hidden="true">
                  <span />
                  <span />
                </span>
              </button>
            </div>

            <ScrollProgress />
          </div>
        </div>
      </header>

      {/* Outside the header: its backdrop blur would trap a fixed child. */}
      <Navigator
        open={menu}
        origin={origin}
        onClose={close}
        t={t}
        name={name}
        pages={links.map((l) => ({ href: l.href, label: t[l.key] }))}
        isActive={isActive}
      />
    </>
  )
}

/**
 * The progress line under the bar. Reads the scroll position once per frame
 * and hands it to CSS as --p. The page height is measured on resize and when
 * the content changes, not on every scroll, so the line can't jump around
 * while images load or the phone's toolbar slides in and out.
 */
function ScrollProgress() {
  const line = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = line.current
    if (!el) return
    const root = document.documentElement
    let max = 1
    let frame = 0
    let width = 0
    let tallest = 0
    const paint = () => {
      frame = 0
      const p = Math.min(1, Math.max(0, window.scrollY / max))
      el.style.setProperty("--p", p.toFixed(4))
    }
    const measure = () => {
      // Keep the tallest viewport height seen at this width, so the phone
      // or tablet toolbar sliding in and out doesn't change the total.
      if (window.innerWidth !== width) {
        width = window.innerWidth
        tallest = 0
      }
      tallest = Math.max(tallest, window.innerHeight, root.clientHeight)
      max = Math.max(1, root.scrollHeight - tallest)
      paint()
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
      cancelAnimationFrame(frame)
    }
  }, [])
  return <span ref={line} className="topbar__progress" aria-hidden="true" />
}

/** True once the page has scrolled away from the very top. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])
  return scrolled
}

/**
 * Each language is its own prerendered page set behind the same URL, so a
 * switch re-requests the current page; the proxy serves the new language.
 */
function useLangSwitch(lang: Lang) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const choose = useCallback(
    (target: Lang) => {
      if (target === lang) return
      document.cookie = `lang=${target}; path=/; max-age=31536000; samesite=lax`
      document.documentElement.lang = target
      startTransition(() => router.refresh())
    },
    [lang, router],
  )

  // One-time carry-over from the old site, which kept the choice in localStorage.
  useEffect(() => {
    try {
      if (document.cookie.includes("lang=")) return
      const old = localStorage.getItem("language")
      if (old === "mk" || old === "en") choose(old)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { choose, pending }
}

function ThemeToggle({ t }: { t: Nav }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={dark ? t.themeToLight : t.themeToDark}
      title={dark ? t.themeToLight : t.themeToDark}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun weight="bold" aria-hidden="true" /> : <Moon weight="bold" aria-hidden="true" />}
    </button>
  )
}
