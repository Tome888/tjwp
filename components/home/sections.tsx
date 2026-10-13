import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"
import {
  ArrowUpRight,
  CaretRight,
  Handshake,
  QrCode,
  RocketLaunch,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr"
import type { Icon } from "@phosphor-icons/react"
import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"
import { featuredProjects, imagePath, toCard } from "@/lib/content"
import { ProjectImage } from "@/components/project-image"
import { FeaturedWork } from "@/components/projects/project-cards"
import { leadSentence } from "./hero"

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

/** The intro statement under the hero. */
export function Statement({ lang }: { lang: Lang }) {
  const [lead, rest] = leadSentence(site.profile.intro[lang])
  return (
    <section className="wrap section">
      <p className="statement" data-reveal>
        {lead} <span className="text-[var(--label-2)]">{rest}</span>
      </p>
    </section>
  )
}

const serviceLook: Array<{ icon: Icon; color: string }> = [
  { icon: Handshake, color: "var(--accent-fill)" },
  { icon: UsersThree, color: "var(--indigo)" },
  { icon: RocketLaunch, color: "var(--green)" },
]

/** What I do: a swipeable rail of cards on phones, a row on wider screens. */
export function Services({ lang }: { lang: Lang }) {
  const t = getDict(lang).home
  return (
    <section className="wrap section" aria-labelledby="services-title">
      <SectionHead id="services-title" title={t.servicesLabel} />
      <ul className="rail">
        {site.services.map((s, i) => {
          const look = serviceLook[i % serviceLook.length]
          const Icon = look.icon
          return (
            <li key={i} className="card service" data-reveal style={{ "--d": i } as Vars}>
              <span className="icon-tile" style={{ background: look.color }} aria-hidden="true">
                <Icon weight="fill" />
              </span>
              <h3 className="title-3">{s.title[lang]}</h3>
              <p className="callout">{s.text[lang]}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** My products: one dark feature card per product. */
export function Products({ lang }: { lang: Lang }) {
  const t = getDict(lang).home
  if (!site.products.length) return null
  return (
    <section className="wrap section" aria-labelledby="products-title">
      <SectionHead id="products-title" title={t.productsLabel} />
      {site.products.map((product) => (
        <article key={product.name} className="product" data-reveal>
          <div>
            {product.status ? <span className="badge badge--on-dark">{product.status[lang]}</span> : null}
            <h3 className="product__name">{product.name}</h3>
            <p className="product__text">{product.summary[lang]}</p>
            {product.link ? (
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="btn btn--light mt-6">
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
                sizes="(min-width: 768px) 520px, 100vw"
              />
            </div>
          ) : (
            <div className="product__art" aria-hidden="true">
              <QrCode weight="duotone" />
            </div>
          )}
        </article>
      ))}
    </section>
  )
}

/** Selected work: featured projects as big cards that open in a sheet. */
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
            <CaretRight weight="bold" aria-hidden="true" />
          </Link>
        }
      />
      <FeaturedWork items={featuredProjects.map((p) => toCard(p, lang))} t={t.projects} />
    </section>
  )
}
