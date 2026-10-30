"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState, useTransition, type MouseEvent } from "react"
import { Moon, Sun } from "@phosphor-icons/react"
import type { Lang } from "@/content/types"
import type { Dict } from "@/i18n/en"

type Nav = Dict["nav"]

// Home is the name on the left, so it isn't repeated here.
const links: Array<{ href: string; key: "projects" | "about" | "contact" }> = [
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
  const initials = `${Array.from(firstName)[0] ?? ""}${Array.from(lastName)[0] ?? ""}`
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`))

  // Tapping the page you're already on scrolls back to the top.
  const onNav = (e: MouseEvent, href: string) => {
    if (!isActive(href)) return
    e.preventDefault()
    const calm = document.documentElement.dataset.motion === "reduced"
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" })
  }

  return (
    <header className="topbar">
      <div className="wrap topbar__inner">
        <Link
          href="/"
          className="brand"
          aria-label={`${name}, ${t.home}`}
          aria-current={isActive("/") ? "page" : undefined}
          onClick={(e) => onNav(e, "/")}
        >
          <span className="brand__mark" aria-hidden="true">
            {initials}
          </span>
          <span className="hidden md:inline">{name}</span>
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
        </div>
      </div>
    </header>
  )
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
