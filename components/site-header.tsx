"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useLayoutEffect, useRef, useState, useTransition, type MouseEvent, type RefObject } from "react"
import { Briefcase, EnvelopeSimple, House, Moon, Sun, User, type Icon } from "@phosphor-icons/react"
import type { Lang } from "@/content/types"
import type { Dict } from "@/i18n/en"
import { Glass } from "@/components/glass/glass"

type Nav = Dict["nav"]

const links: Array<{ href: string; key: "home" | "projects" | "about" | "contact"; icon: Icon }> = [
  { href: "/", key: "home", icon: House },
  { href: "/projects", key: "projects", icon: Briefcase },
  { href: "/about", key: "about", icon: User },
  { href: "/contact", key: "contact", icon: EnvelopeSimple },
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
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`))
  const activeIndex = links.findIndex((l) => isActive(l.href))
  const pageTitle = activeIndex > 0 ? t[links[activeIndex].key] : name
  const collapsed = useCollapsedTitle(pathname)

  // Tapping the tab you're already on scrolls back to the top, as in iOS.
  const onNav = (e: MouseEvent, href: string) => {
    if (!isActive(href)) return
    e.preventDefault()
    const calm = document.documentElement.dataset.motion === "reduced"
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" })
  }

  const desktop = useRef<HTMLDivElement>(null)
  const phone = useRef<HTMLDivElement>(null)
  const desktopBlob = useSelection(desktop, activeIndex)
  const phoneBlob = useSelection(phone, activeIndex)

  return (
    <>
      <Glass fixed className="topbar" data-collapsed={collapsed ? "true" : "false"}>
        <Link href="/" className="topbar__title" aria-label={`${name}, ${t.home}`} onClick={(e) => onNav(e, "/")}>
          <span className="md:hidden">{pageTitle}</span>
          <span className="hidden md:inline">{name}</span>
        </Link>

        <nav aria-label={t.label} className="topbar__links">
          <div ref={desktop} className="relative flex h-full items-center">
            <span className="glass-select" {...desktopBlob} aria-hidden="true" />
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="topbar__link"
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={(e) => onNav(e, link.href)}
              >
                {t[link.key]}
              </Link>
            ))}
          </div>
        </nav>

        <div className="topbar__tools">
          <LangSwitch lang={lang} t={t} />
          <ThemeToggle t={t} />
        </div>
      </Glass>

      <Glass fixed className="tabbar">
        <nav aria-label={t.label} ref={phone} className="relative flex h-full w-full items-center">
          <span className="glass-select" {...phoneBlob} aria-hidden="true" />
          {links.map((link) => {
            const active = isActive(link.href)
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="tab"
                aria-current={active ? "page" : undefined}
                onClick={(e) => onNav(e, link.href)}
              >
                <Icon weight={active ? "fill" : "regular"} aria-hidden="true" />
                {t[link.key]}
              </Link>
            )
          })}
        </nav>
      </Glass>
    </>
  )
}

/**
 * Places the glass selection blob under the active item and lets it spring
 * (with a quick liquid stretch) when the active item changes.
 */
function useSelection(container: RefObject<HTMLElement | null>, index: number) {
  const [box, setBox] = useState<{ left: number; width: number } | null>(null)
  const [stretch, setStretch] = useState(false)
  const previous = useRef(index)

  useLayoutEffect(() => {
    const el = container.current
    if (!el) return
    const update = () => {
      const target = el.querySelectorAll<HTMLElement>("a")[index]
      setBox(target && target.offsetWidth ? { left: target.offsetLeft, width: target.offsetWidth } : null)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [container, index])

  useEffect(() => {
    if (previous.current === index) return
    previous.current = index
    if (index < 0) return
    setStretch(true)
    const id = setTimeout(() => setStretch(false), 200)
    return () => clearTimeout(id)
  }, [index])

  return {
    style: box ? { left: box.left, width: box.width } : undefined,
    "data-ready": box ? "" : undefined,
    "data-stretch": stretch ? "" : undefined,
  }
}

/**
 * On phones the top bar shows the page title once the big title on the page
 * has scrolled away, like an iOS navigation bar.
 */
function useCollapsedTitle(pathname: string) {
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    setCollapsed(false)
    let io: IntersectionObserver | null = null
    const id = requestAnimationFrame(() => {
      const title = document.querySelector("#page [data-large-title]")
      if (!title) return
      io = new IntersectionObserver(
        ([entry]) => setCollapsed(!entry.isIntersecting && entry.boundingClientRect.top < 80),
        { rootMargin: "-70px 0px 0px 0px" },
      )
      io.observe(title)
    })
    return () => {
      cancelAnimationFrame(id)
      io?.disconnect()
    }
  }, [pathname])
  return collapsed
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
      className="icon-btn text-[21px]"
      aria-label={dark ? t.themeToLight : t.themeToDark}
      title={dark ? t.themeToLight : t.themeToDark}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun weight="bold" aria-hidden="true" /> : <Moon weight="bold" aria-hidden="true" />}
    </button>
  )
}
