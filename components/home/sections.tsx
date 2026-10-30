import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"
import { ArrowUpRight, QrCode } from "@phosphor-icons/react/dist/ssr"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"
import { featuredProjects, imagePath, toCard } from "@/lib/content"
import { ProjectImage } from "@/components/project-image"
import { FeaturedWork } from "@/components/projects/project-cards"

type Vars = CSSProperties & Record<`--${string}`, string | number>

export function SectionHead({ id, title, more }: { id?: string; title: string; more?: ReactNode }) {
  return (
    <div className="section__head" data-reveal>
      <h2 id={id} className="title-2">
        {title}
      </h2>
      {more}
    </div>
  )
}

/** What I do: three plain columns. */
export function Services({ lang }: { lang: Lang }) {
  const t = getDict(lang).home
  return (
    <div className="band band--shade">
    <section className="wrap section" aria-labelledby="services-title">
      <SectionHead id="services-title" title={t.servicesLabel} />
      <ul className="services">
        {site.services.map((s, i) => (
          <li key={i} className="service" data-reveal style={{ "--d": i } as Vars}>
            <h3 className="title-3">{s.title[lang]}</h3>
            <p>{s.text[lang]}</p>
          </li>
        ))}
      </ul>
    </section>
    </div>
  )
}

/** My products: one row per product. */
export function Products({ lang }: { lang: Lang }) {
  const t = getDict(lang).home
  if (!site.products.length) return null
  return (
    <div className="band band--deep">
    <section className="wrap section" aria-labelledby="products-title">
      <SectionHead id="products-title" title={t.productsLabel} />
      <div className="grid gap-16">
        {site.products.map((product) => (
          <article key={product.name} className="product" data-reveal>
            <div>
              {product.status ? <p className="status">{product.status[lang]}</p> : null}
              <h3 className="product__name">{product.name}</h3>
              <p className="product__text">{product.summary[lang]}</p>
              {product.link ? (
                <a href={product.link} target="_blank" rel="noopener noreferrer" className="btn btn--tinted mt-6">
                  {t.visit}
                  <ArrowUpRight weight="bold" aria-hidden="true" />
                </a>
              ) : null}
            </div>
            {product.image ? (
              <div className="product__media">
                <ProjectImage
                  src={imagePath(product.image)}
                  title={product.name}
                  sizes="(min-width: 768px) 700px, 100vw"
                />
              </div>
            ) : (
              <div className="product__art" aria-hidden="true">
                <QrCode weight="regular" />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
    </div>
  )
}

/** Selected work: featured projects as large rows that open in a sheet. */
export function Work({ lang }: { lang: Lang }) {
  const t = getDict(lang)
  if (!featuredProjects.length) return null
  return (
    <section id="work" className="wrap section" aria-labelledby="work-title">
      <SectionHead
        id="work-title"
        title={t.home.workLabel}
        more={
          <Link href="/projects" className="more-link">
            {t.home.allWork}
          </Link>
        }
      />
      <FeaturedWork items={featuredProjects.map((p) => toCard(p, lang))} t={t.projects} />
    </section>
  )
}
