import type { Metadata } from "next"
import type { CSSProperties } from "react"
import { getDict, langFrom, type LangParams } from "@/lib/i18n"
import { projects, toCard } from "@/lib/content"
import { Products, SectionHead } from "@/components/home/sections"
import { ProjectIndex } from "@/components/projects/project-cards"
import { CtaCard } from "@/components/cta-card"

export async function generateMetadata(props: LangParams): Promise<Metadata> {
  const t = getDict(await langFrom(props)).meta
  return { title: t.projects, description: t.projectsDescription }
}

export default async function ProjectsPage(props: LangParams) {
  const lang = await langFrom(props)
  const t = getDict(lang)
  const items = projects.map((p) => toCard(p, lang))

  return (
    <>
      <section className="wrap page-head">
        <h1 className="large-title enter" data-large-title>
          {t.projects.title}
        </h1>
        <p className="lead enter mt-3" style={{ "--d": 1 } as CSSProperties}>
          {t.projects.lead}
        </p>
      </section>

      <section className="wrap section" aria-labelledby="index-title">
        <SectionHead id="index-title" title={t.projects.indexLabel} />
        <ProjectIndex items={items} t={t.projects} />
      </section>

      <Products lang={lang} />
      <CtaCard lang={lang} />
    </>
  )
}
