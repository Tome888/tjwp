import { langFrom, type LangParams } from "@/lib/i18n"
import { Hero } from "@/components/home/hero"
import { Products, Services, Work } from "@/components/home/sections"
import { CtaCard } from "@/components/cta-card"
import { SectionRail } from "@/components/home/section-rail"
import { getDict } from "@/lib/i18n"
import { homeSections } from "@/lib/sections"

export default async function Home(props: LangParams) {
  const lang = await langFrom(props)
  return (
    <>
      <Hero lang={lang} />
      <Work lang={lang} />
      <Services lang={lang} />
      <Products lang={lang} />
      <CtaCard lang={lang} />
      <SectionRail sections={homeSections(lang)} label={getDict(lang).nav.sections} />
    </>
  )
}
