import type { Metadata } from "next"
import { getDict, langFrom, type LangParams } from "@/lib/i18n"
import { projects, toCard } from "@/lib/content"
import { Products } from "@/components/home/sections"
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
        <h1 className="large-title">{t.projects.title}</h1>
        <p className="lead mt-6">{t.projects.lead}</p>
      </section>

      <section className="wrap section !pt-6" aria-label={t.projects.indexLabel}>
        <ProjectIndex items={items} t={t.projects} />
      </section>

      <Products lang={lang} />
      <CtaCard lang={lang} />
    </>
  )
}
