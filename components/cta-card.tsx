import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"

/** The cobalt "got something to build?" card that closes most pages. */
export function CtaCard({ lang }: { lang: Lang }) {
  const t = getDict(lang).cta
  return (
    <section className="wrap section" aria-labelledby="cta-title">
      <div className="cta" data-reveal>
        <span className="cta__orb" aria-hidden="true" />
        <span className="cta__orb cta__orb--2" aria-hidden="true" />
        <div className="relative">
          <h2 id="cta-title" className="cta__title">
            {t.title}
          </h2>
          <p className="cta__text">{t.text}</p>
          <div className="cta__actions">
            <Link href="/contact" className="btn btn--light">
              {t.button}
              <ArrowRight weight="bold" aria-hidden="true" />
            </Link>
            <a href={`mailto:${site.contact.email}`} className="cta__email">
              {site.contact.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
