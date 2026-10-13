import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"
import { Glass } from "@/components/glass/glass"

/** The cobalt "got something to build?" card that closes most pages. */
export function CtaCard({ lang }: { lang: Lang }) {
  const t = getDict(lang).cta
  return (
    <section className="wrap section" aria-labelledby="cta-title">
      <div className="cta" data-reveal data-glass-src="cta">
        <span className="cta__orb" aria-hidden="true" />
        <span className="cta__orb cta__orb--2" aria-hidden="true" />
        <div className="relative">
          <h2 id="cta-title" className="cta__title">
            {t.title}
          </h2>
          <p className="cta__text">{t.text}</p>
          <div className="cta__actions">
            <Glass className="glass-btn glass-btn--on-color" snapshot='[data-glass-src="cta"]'>
              <Link href="/contact" className="glass-btn__link">
                {t.button}
                <ArrowRight weight="bold" aria-hidden="true" />
              </Link>
            </Glass>
            <a href={`mailto:${site.contact.email}`} className="cta__email">
              {site.contact.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
