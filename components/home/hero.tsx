import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { ArrowDown, ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"
import { Glass } from "@/components/glass/glass"

type Vars = CSSProperties & Record<`--${string}`, string | number>

/** Splits "First sentence. The rest." so the first sentence can stand out. */
export function leadSentence(text: string) {
  const at = text.search(/[.!?]\s/)
  return at === -1 ? [text, ""] : [text.slice(0, at + 1), text.slice(at + 2)]
}

export function Hero({ lang }: { lang: Lang }) {
  const t = getDict(lang).home
  const p = site.profile
  const first = p.firstName[lang]
  const last = p.lastName[lang]
  const [lead, rest] = leadSentence(p.tagline[lang])

  return (
    <section className="wrap page-head" aria-labelledby="hero-name">
      <div className="hero">
        <div>
          {p.available ? (
            <p className="status-chip enter">
              <span className="status-chip__dot" aria-hidden="true" />
              {p.availability[lang]}
            </p>
          ) : null}
          <p className="eyebrow enter mt-5" style={{ "--d": 1 } as Vars}>
            {p.role[lang]} · {p.location[lang]}
          </p>
          <h1 id="hero-name" className="hero__name enter" data-large-title style={{ "--d": 2 } as Vars}>
            {first}
            <br />
            {last}
          </h1>
          <p className="hero__tagline enter" style={{ "--d": 3 } as Vars}>
            <strong>{lead}</strong> {rest}
          </p>
          <div className="hero__actions enter" style={{ "--d": 4 } as Vars}>
            <a href="#work" className="btn btn--tinted">
              {t.seeWork}
              <ArrowDown weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="hero__card enter" style={{ "--d": 3 } as Vars}>
          <Image
            src={`/${p.photo}`}
            alt={`${first} ${last}`}
            fill
            priority
            sizes="(min-width: 900px) 46vw, 100vw"
            className="object-cover object-[50%_28%]"
          />
          <Glass className="hero__cta">
            <Link href="/contact">
              {t.start}
              <ArrowRight weight="bold" aria-hidden="true" />
            </Link>
          </Glass>
        </div>
      </div>
    </section>
  )
}
