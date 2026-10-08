import Link from "next/link"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"
import { Chars, Roll } from "@/components/motion/kinetic"

/** The olive "let's talk" band that closes most pages. */
export function CtaBand({ lang }: { lang: Lang }) {
  const t = getDict(lang).cta
  return (
    <section className="band" aria-labelledby="cta-title">
      <div className="wrap grid grid-cols-4 gap-x-[var(--gutter)] py-[clamp(5rem,14vw,11rem)] md:grid-cols-8 lg:grid-cols-12">
        <h2
          id="cta-title"
          className="display col-span-4 text-[clamp(3.25rem,10.5vw,10rem)] leading-[0.9] tracking-[-0.03em] md:col-span-8 lg:col-span-11"
        >
          <span data-k="scale" className="block">
            <span data-reveal="mask" className="block">
              <Chars text={t.title} className="mask" by="word" />
            </span>
          </span>
        </h2>
        <div
          data-reveal
          className="col-span-4 mt-10 flex flex-col gap-8 md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-7 lg:mt-16"
        >
          <p className="text-lg leading-relaxed text-band-soft md:text-xl">{t.text}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/contact" className="btn btn--accent roll-host">
              <Roll text={t.button} arrow="right" />
            </Link>
            <a href={`mailto:${site.contact.email}`} className="roll-host underline-offset-4 text-band-ink">
              <Roll text={site.contact.email} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
