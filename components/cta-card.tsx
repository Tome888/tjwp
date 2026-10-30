import Link from "next/link"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"

/** The "got something to build?" block that closes most pages. */
export function CtaCard({ lang }: { lang: Lang }) {
  const t = getDict(lang).cta
  return (
    <section className="wrap section" aria-labelledby="cta-title">
      <div className="cta">
        <h2 id="cta-title" className="cta__title">
          {t.title}
        </h2>
        <div>
          <p className="cta__text">{t.text}</p>
          <div className="cta__actions">
            <Link href="/contact" className="btn btn--fill">
              {t.button}
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
