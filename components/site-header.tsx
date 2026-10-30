"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState, useTransition, type CSSProperties, type MouseEvent } from "react"
import { Moon, Sun } from "@phosphor-icons/react"
import type { Lang } from "@/content/types"
import type { Dict } from "@/i18n/en"
import { Logo } from "@/components/logo"

type Nav = Dict["nav"]
type Vars = CSSProperties & Record<`--${string}`, string | number>

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
  const [menu, setMenu] = useState(false)
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`))

  // Close the phone menu on navigation, on Esc, and when the screen gets wide.
  useEffect(() => setMenu(false), [pathname])
  useEffect(() => {
    if (!menu) return
    const root = document.documentElement
    root.classList.add("menu-open")
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false)
    const wide = matchMedia("(min-width: 720px)")
    const onWide = () => wide.matches && setMenu(false)
    window.addEventListener("keydown", onKey)
    wide.addEventListener("change", onWide)
    return () => {
      root.classList.remove("menu-open")
      window.removeEventListener("keydown", onKey)
      wide.removeEventListener("change", onWide)
    }
  }, [menu])

  // Tapping the page you're already on scrolls back to the top.
  const onNav = (e: MouseEvent, href: string) => {
    setMenu(false)
    if (!isActive(href)) return
    e.preventDefault()
    const calm = document.documentElement.dataset.motion === "reduced"
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" })
  }

  return (
    <>
    <header className="topbar" data-scrolled={scrolled && !menu ? "" : undefined} data-menu={menu ? "" : undefined}>
      <div className="wrap topbar__inner">
        <Link href="/" className="brand" aria-label={`${name}, ${t.home}`} onClick={(e) => onNav(e, "/")}>
          <Logo className="brand__mark" />
          {/* Slides in behind the logo once the page is scrolled. */}
          <span className="brand__clip" aria-hidden="true">
            <span className="brand__name">{name}</span>
          </span>
        </Link>

        <nav aria-label={t.label} className="nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              onClick={(e) => onNav(e, link.href)}
            >
              {t[link.key]}
            </Link>
          ))}
        </nav>

        <div className="tools">
          <LangSwitch lang={lang} t={t} />
          <ThemeToggle t={t} />
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={menu}
            aria-controls="phone-menu"
            aria-label={menu ? t.close : t.menu}
            onClick={() => setMenu((m) => !m)}
          >
            <span className="menu-btn__lines" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </header>

    {/* Outside the header: its backdrop blur would trap a fixed child. */}
    <nav id="phone-menu" aria-label={t.label} className="phone-menu" data-open={menu ? "" : undefined} inert={!menu}>
        <ul>
          {links.map((link, i) => (
            <li key={link.href} style={{ "--i": i } as Vars}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={(e) => onNav(e, link.href)}
              >
                {t[link.key]}
              </Link>
            </li>
          ))}
        </ul>
    </nav>
    </>
  )
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

function LangSwitch({ lang, t }: { lang: Lang; t: Nav }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const next: Lang = lang === "en" ? "mk" : "en"

  // Each language is its own prerendered page set behind the same URL, so a
  // switch re-requests the current page; the proxy serves the new language.
  const choose = (target: Lang) => {
    if (target === lang) return
    document.cookie = `lang=${target}; path=/; max-age=31536000; samesite=lax`
    document.documentElement.lang = target
    startTransition(() => router.refresh())
  }

  // One-time carry-over from the old site, which kept the choice in localStorage.
  useEffect(() => {
    try {
      if (document.cookie.includes("lang=")) return
      const old = localStorage.getItem("language")
      if (old === "mk" || old === "en") choose(old)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <button
      type="button"
      lang={next}
      className="icon-btn"
      aria-label={t.switchLang}
      title={t.switchLang}
      data-pending={pending || undefined}
      onClick={() => choose(next)}
    >
      {next.toUpperCase()}
    </button>
  )
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
