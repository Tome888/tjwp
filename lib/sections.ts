import { site } from "@/content/site"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"
import { featuredProjects } from "@/lib/content"

export interface PageSection {
  id: string
  label: string
}

/** The home page's sections, in order: used by the side rail and the navigator. */
export function homeSections(lang: Lang): PageSection[] {
  const t = getDict(lang)
  return [
    { id: "intro", label: t.nav.intro },
    ...(featuredProjects.length ? [{ id: "work", label: t.home.workLabel }] : []),
    { id: "services", label: t.home.servicesLabel },
    ...(site.products.length ? [{ id: "products", label: t.home.productsLabel }] : []),
    { id: "get-in-touch", label: t.nav.contact },
  ]
}
