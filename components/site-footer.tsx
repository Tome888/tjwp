import Link from "next/link"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"
import { Roll } from "@/components/motion/kinetic"
import { MotionToggle } from "@/components/motion/motion-toggle"

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = getDict(lang)
  const { profile, contact } = site
  const pages = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/projects", label: t.nav.projects },
    { href: "/contact", label: t.nav.contact },
  ]

  return (
    <footer className="site-footer">
      <div className="wrap grid grid-cols-4 gap-x-[var(--gutter)] gap-y-10 pt-20 pb-10 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-5 lg:col-span-6">
          <p className="label mb-4">{t.contact.emailLabel}</p>
          <a href={`mailto:${contact.email}`} className="roll-host break-all text-[clamp(1.25rem,3vw,2.25rem)] leading-tight">
            <Roll text={contact.email} />
          </a>
        </div>
        <nav aria-label={t.nav.label} className="col-span-2 md:col-span-1 lg:col-span-2 lg:col-start-8">
          <ul className="space-y-2">
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="roll-host">
                  <Roll text={p.label} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="col-span-2 space-y-2 md:col-span-2 lg:col-span-2">
          {contact.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="roll-host">
                <Roll text={l.label} arrow="out" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer-mark" aria-hidden="true">
        <div data-k="rise" className="display footer-mark__text">
          {profile.firstName[lang]} <em>{profile.lastName[lang]}</em>
        </div>
      </div>

      <div className="wrap flex flex-col gap-2 border-t border-line py-6 text-sm text-soft md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.firstName[lang]} {profile.lastName[lang]}. {t.footer.rights}
        </p>
        <MotionToggle t={t.nav} />
        <a href="#top" className="roll-host self-start md:self-auto">
          <Roll text={t.footer.top} arrow="up" />
        </a>
      </div>
    </footer>
  )
}
