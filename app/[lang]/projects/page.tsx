import type { Metadata } from "next"
import type { CSSProperties } from "react"
import { getDict, langFrom, type LangParams } from "@/lib/i18n"
import { imagePath, pad, projects } from "@/lib/content"
import { Chars } from "@/components/motion/kinetic"
import { Products, SectionLabel } from "@/components/home/sections"
import { ProjectIndex, type IndexItem } from "@/components/projects/project-index"
import { CtaBand } from "@/components/cta-band"

export async function generateMetadata(props: LangParams): Promise<Metadata> {
  const t = getDict(await langFrom(props)).meta
  return { title: t.projects, description: t.projectsDescription }
}

export default async function ProjectsPage(props: LangParams) {
  const lang = await langFrom(props)
  const t = getDict(lang)
  const items: IndexItem[] = projects.map((p) => ({
    slug: p.slug,
    number: pad(p.index + 1),
    title: p.title[lang],
    summary: p.summary[lang],
    details: p.details[lang],
    tags: p.tags,
    link: p.link,
    image: imagePath(p.image),
  }))

  return (
    <>
      <section className="wrap page-head grid12">
        <h1
          className="display page-title intro col-span-4 md:col-span-8 lg:col-span-12"
          style={{ "--len": Array.from(t.projects.title).length } as CSSProperties}
        >
          <Chars text={t.projects.title} className="mask kinetic" />
          <sup className="page-title__count">({pad(items.length)})</sup>
        </h1>
        <p className="page-lead intro-fade col-span-4 md:col-span-5 md:col-start-4 lg:col-span-5 lg:col-start-8">
          {t.projects.lead}
        </p>
      </section>

      <Products lang={lang} index={1} />

      <section className="wrap section" aria-labelledby="index-label">
        <SectionLabel index={2} id="index-label" as="h2">
          {t.projects.indexLabel}
        </SectionLabel>
        <ProjectIndex items={items} t={t.projects} />
      </section>

      <CtaBand lang={lang} />
    </>
  )
}
