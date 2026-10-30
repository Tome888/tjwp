import Link from "next/link"
import { ArrowUp } from "@phosphor-icons/react/dist/ssr"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"
import { MotionToggle } from "@/components/motion/motion-toggle"

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = getDict(lang)
  const { profile, contact } = site
  const name = `${profile.firstName[lang]} ${profile.lastName[lang]}`
  const pages = [
    { href: "/", label: t.nav.home },
    { href: "/projects", label: t.nav.projects },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ]

  return (
    <footer className="wrap footer">
      <div className="footer__grid">
        <div>
          <p className="footer__name">{name}</p>
          <p className="footnote mt-1">{profile.role[lang]}</p>
          <a href={`mailto:${contact.email}`} className="more-link mt-4 break-all">
            {contact.email}
          </a>
        </div>
        <nav aria-label={t.nav.label}>
          <ul className="footer__links">
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href}>{p.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="footer__links">
          {contact.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer__bottom">
        <p className="footnote">
          © {new Date().getFullYear()} {name}. {t.footer.rights}
        </p>
        <MotionToggle t={t.nav} />
        <a href="#top" className="more-link text-[15px]">
          {t.footer.top}
          <ArrowUp weight="bold" aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
