import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"

type Vars = CSSProperties & Record<`--${string}`, string | number>

/** Splits "First sentence. The rest." so the first sentence can stand out. */
export function leadSentence(text: string) {
  const at = text.search(/[.!?]\s/)
  return at === -1 ? [text, ""] : [text.slice(0, at + 1), text.slice(at + 2)]
}

/**
 * The name in both scripts: the page's language first and heavy, the other
 * one under it in a hairline weight. Switching language swaps them.
 */
export function Hero({ lang }: { lang: Lang }) {
  const t = getDict(lang).home
  const p = site.profile
  const other: Lang = lang === "en" ? "mk" : "en"
  const main = `${p.firstName[lang]} ${p.lastName[lang]}`
  const alt = `${p.firstName[other]} ${p.lastName[other]}`
  const [, rest] = leadSentence(p.intro[lang])

  return (
    <section className="wrap hero" aria-labelledby="hero-name">
      <h1 id="hero-name" className="name">
        <span className="name__line name__line--main">
          <span>{main}</span>
        </span>
        <span className="name__line name__line--other" lang={other}>
          <span>{alt}</span>
        </span>
      </h1>

      <div className="hero__grid">
        <div>
          <p className="hero__lead enter">{p.tagline[lang]}</p>
          {rest ? (
            <p className="hero__body enter" style={{ "--d": 1 } as Vars}>
              {rest}
            </p>
          ) : null}
          <p className="hero__meta enter" style={{ "--d": 2 } as Vars}>
            {p.role[lang]}, {p.location[lang]}.
            {p.available ? (
              <>
                {" "}
                <strong>{p.availability[lang]}.</strong>
              </>
            ) : null}
          </p>
          <div className="hero__actions enter" style={{ "--d": 3 } as Vars}>
            <a href="#work" className="btn btn--ink">
              {t.seeWork}
            </a>
            <Link href="/contact" className="more-link">
              {t.start}
            </Link>
          </div>
        </div>

        <div className="hero__photo enter" style={{ "--d": 1 } as Vars}>
          <Image
            src={`/${p.photo}`}
            alt={main}
            fill
            priority
            sizes="(min-width: 900px) 420px, 62vw"
            className="object-cover object-[50%_20%]"
          />
        </div>
      </div>
    </section>
  )
}
