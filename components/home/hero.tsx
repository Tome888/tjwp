import Image from "next/image"
import Link from "next/link"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"
import { Chars, Roll } from "@/components/motion/kinetic"

export function Hero({ lang }: { lang: Lang }) {
  const t = getDict(lang).home
  const p = site.profile
  const first = p.firstName[lang]
  const last = p.lastName[lang]

  return (
    <section data-k="hero" className="hero" aria-labelledby="hero-name">
      <div className="wrap hero__inner">
        <div className="hero__meta intro-fade" data-k-fade>
          <p className="label">
            {p.role[lang]} <span className="text-line">/</span> {p.location[lang]}
          </p>
          {p.available ? (
            <p className="label avail">
              <span className="avail__mark" aria-hidden="true" />
              {p.availability[lang]}
            </p>
          ) : null}
        </div>

        <div className="hero__stage">
          <h1
            id="hero-name"
            className="display hero__name intro"
            data-script={/[Ѐ-ӿ]/.test(last) ? "cyrillic" : "latin"}
          >
            <span className="hero__line hero__line--first" data-k-line="-1">
              <Chars text={first} className="mask kinetic" />
            </span>{" "}
            <span className="hero__line hero__line--last" data-k-line="1">
              <em>
                <Chars text={last} start={Array.from(first).length} className="mask kinetic" />
              </em>
            </span>
          </h1>
          <div className="hero__portrait" data-k-portrait>
            <div className="hero__portrait-frame">
              <Image
                src={`/${p.photo}`}
                alt={`${first} ${last}`}
                fill
                priority
                sizes="(min-width: 1024px) 22vw, 34vw"
                className="object-cover object-[50%_30%]"
              />
            </div>
          </div>
        </div>

        <div className="hero__foot intro-fade" data-k-fade style={{ animationDelay: "0.5s" }}>
          <p className="hero__tagline">{p.tagline[lang]}</p>
          <div className="hero__ctas">
            <Link href="/contact" className="btn btn--accent roll-host">
              <Roll text={t.start} arrow="right" />
            </Link>
            <a href="#work" className="link roll-host">
              <Roll text={t.seeWork} />
            </a>
          </div>
          <span className="hero__scroll label" aria-hidden="true">
            {t.scroll}
            <span className="hero__scroll-line" />
          </span>
        </div>
      </div>
    </section>
  )
}
