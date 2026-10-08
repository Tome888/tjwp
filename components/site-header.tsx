"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState, useTransition, type CSSProperties } from "react"
import type { Lang } from "@/content/types"
import type { Dict } from "@/i18n/en"
import { Roll } from "@/components/motion/kinetic"

type Nav = Dict["nav"]

const links = [
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/contact", key: "contact" },
] as const

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
  const pathname = usePathname()
  const bar = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDialogElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // Hide while scrolling down, show again on scroll up.
  useEffect(() => {
    const el = bar.current
    if (!el) return
    let last = window.scrollY
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY
      el.dataset.scrolled = y > 8 ? "true" : "false"
      if (Math.abs(y - last) < 6) return
      el.dataset.hidden = y > last && y > 160 ? "true" : "false"
      last = y
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    menu.current?.close()
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header
        ref={bar}
        className="site-header"
        data-hidden="false"
        data-scrolled="false"
        onFocusCapture={() => bar.current && (bar.current.dataset.hidden = "false")}
      >
        <div className="wrap flex h-16 items-center justify-between gap-6 md:h-20">
          <Link href="/" className="brand roll-host" aria-label={`${firstName} ${lastName}, ${t.home}`}>
            <span className="display text-[1.35rem] leading-none md:text-[1.6rem]">
              {firstName} <em>{lastName}</em>
            </span>
          </Link>

          <nav aria-label={t.label} className="hidden md:block">
            <ul className="flex items-center gap-10">
              {links.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="nav-link roll-host"
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    <span className="nav-link__num" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <Roll text={t[link.key]} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <LangSwitch lang={lang} label={t.language} />
            <div className="hidden md:block">
              <ThemeToggle t={t} />
            </div>
            <button
              type="button"
              className="label-btn md:hidden"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => menu.current?.showModal()}
            >
              {t.menu}
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={menu}
        className="menu"
        aria-label={t.label}
        onClose={() => setMenuOpen(false)}
        onToggle={(e) => setMenuOpen((e.target as HTMLDialogElement).open)}
      >
        <div className="wrap flex h-16 items-center justify-between">
          <span className="display text-[1.35rem]">
            {firstName} <em>{lastName}</em>
          </span>
          <button type="button" className="label-btn" onClick={() => menu.current?.close()}>
            {t.close}
          </button>
        </div>
        <nav aria-label={t.label} className="wrap mt-[8vh]">
          <ul className="menu__list">
            {[{ href: "/", key: "home" as const }, ...links].map((link, i) => (
              <li key={link.href} style={{ "--d": i } as CSSProperties}>
                <Link href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
                  <span className="menu__num">0{i}</span>
                  {t[link.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="wrap menu__foot">
          <ThemeToggle t={t} />
        </div>
      </dialog>
    </>
  )
}

function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  // Each language is its own prerendered page set behind the same URL, so a
  // switch re-requests the current page; the proxy serves the new language.
  const choose = (next: Lang) => {
    if (next === lang) return
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`
    document.documentElement.lang = next
    startTransition(() => router.refresh())
  }

  // One-time carry-over from the old site, which kept the choice in localStorage.
  useEffect(() => {
    try {
      if (document.cookie.includes("lang=")) return
      const old = localStorage.getItem("language")
      if (old === "mk" || old === "en") choose(old)
    } catch {}
  }, [])

  return (
    <div role="group" aria-label={label} className="lang" data-pending={pending || undefined}>
      <button type="button" lang="en" aria-pressed={lang === "en"} onClick={() => choose("en")}>
        EN
      </button>
      <span aria-hidden="true">/</span>
      <button type="button" lang="mk" aria-pressed={lang === "mk"} onClick={() => choose("mk")}>
        MK
      </button>
    </div>
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
      className="theme-toggle label-btn"
      aria-label={dark ? t.themeToLight : t.themeToDark}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <span className="theme-toggle__dot" aria-hidden="true" />
      <span className="dark:hidden">{t.themeLight}</span>
      <span className="hidden dark:inline">{t.themeDark}</span>
    </button>
  )
}
