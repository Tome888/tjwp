import { site } from "@/content/site"
import type { Lang, Project, Text } from "@/content/types"

export type ProjectEntry = Project & { slug: string; index: number }

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const seen = new Set<string>()
export const projects: ProjectEntry[] = site.projects.map((project, index) => {
  let slug = slugify(project.title.en) || `project-${index + 1}`
  while (seen.has(slug)) slug = `${slug}-${index + 1}`
  seen.add(slug)
  return { ...project, slug, index }
})

// Home page chapters: featured projects, or the first four if none are marked.
const marked = projects.filter((p) => p.featured)
export const featuredProjects = (marked.length ? marked : projects).slice(0, marked.length ? 6 : 4)

export const imagePath = (file?: string) => (file ? `/projects/${file}` : undefined)

export const pad = (n: number) => String(n).padStart(2, "0")

export function localize(lang: Lang) {
  return (text: Text) => text[lang]
}
