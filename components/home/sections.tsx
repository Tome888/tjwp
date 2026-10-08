import type { CSSProperties } from "react"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"
import { imagePath, pad } from "@/lib/content"
import { Chars, Roll, Words } from "@/components/motion/kinetic"
import { ProjectImage } from "@/components/project-image"

type Vars = CSSProperties & Record<`--${string}`, string | number>

export function SectionLabel({
  index,
  children,
  id,
  as: Tag = "p",
}: {
  index: number
  children: string
  id?: string
  as?: "p" | "h2"
}) {
  return (
    <Tag className="label section-label" id={id}>
      <span className="section-label__num">({pad(index)})</span> {children}
    </Tag>
  )
}

/** The intro statement: words fill in with ink as you scroll through it. */
export function Statement({ lang }: { lang: Lang }) {
  return (
    <section className="wrap section grid12">
      <div className="col-span-4 md:col-span-2 lg:col-span-2">
        <SectionLabel index={1}>{site.profile.location[lang]}</SectionLabel>
      </div>
      <p data-k="words" className="display statement col-span-4 md:col-span-8 lg:col-span-10">
        <Words text={site.profile.intro[lang]} />
      </p>
    </section>
  )
}

/** What I do: an offset list rather than a row of cards. */
export function Services({ lang }: { lang: Lang }) {
  const t = getDict(lang).home
  return (
    <section className="wrap section" aria-labelledby="services-label">
      <SectionLabel index={2} id="services-label" as="h2">
        {t.servicesLabel}
      </SectionLabel>
      <ol className="services">
        {site.services.map((s, i) => (
          <li key={i} className="service" data-reveal style={{ "--o": i % 3 } as Vars}>
            <span className="service__num label">{pad(i + 1)}</span>
            <h3 className="display service__title">{s.title[lang]}</h3>
            <p className="service__text">{s.text[lang]}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** My products: giant names that drift sideways as you scroll. */
export function Products({ lang, index = 3 }: { lang: Lang; index?: number }) {
  const t = getDict(lang).home
  if (!site.products.length) return null
  return (
    <section className="section products" aria-labelledby="products-title">
      <div className="wrap grid12 mb-10 md:mb-16">
        <div className="col-span-4 md:col-span-2 lg:col-span-2">
          <SectionLabel index={index}>{t.productsLabel}</SectionLabel>
        </div>
        <h2
          id="products-title"
          data-reveal="mask"
          className="display col-span-4 text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] md:col-span-6 lg:col-span-7"
        >
          <Chars text={t.productsTitle} className="mask" by="word" />
        </h2>
      </div>
      <ul>
        {site.products.map((product, i) => (
          <li key={product.name} className="product">
            <div className="product__row" aria-hidden="true">
              <div
                data-k="drift"
                data-k-amount={i % 2 ? -5 : 5}
                className="display product__name"
                style={{ "--len": Math.max(Array.from(product.name).length, 6) } as Vars}
              >
                {i % 2 ? <em>{product.name}</em> : product.name}
              </div>
            </div>
            <div className="wrap grid12 product__meta" data-reveal>
              <h3 className="sr-only">{product.name}</h3>
              <p className="label col-span-4 md:col-span-2 lg:col-span-2">
                {product.status ? product.status[lang] : `${pad(i + 1)} / ${pad(site.products.length)}`}
              </p>
              <p className="col-span-4 text-lg leading-snug md:col-span-4 lg:col-span-5">{product.summary[lang]}</p>
              {product.link ? (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link roll-host col-span-4 self-start md:col-span-2 lg:col-span-2 lg:col-start-11 lg:justify-self-end"
                >
                  <Roll text={t.visit} arrow="out" />
                </a>
              ) : null}
              {product.image ? (
                <div className="product__thumb col-span-4 md:col-span-3 md:col-start-6 lg:col-span-3 lg:col-start-8">
                  <ProjectImage
                    src={imagePath(product.image)}
                    title={product.name}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 38vw, 92vw"
                  />
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
