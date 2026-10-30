import { langFrom, type LangParams } from "@/lib/i18n"
import { Hero } from "@/components/home/hero"
import { Products, Services, Work } from "@/components/home/sections"
import { CtaCard } from "@/components/cta-card"

export default async function Home(props: LangParams) {
  const lang = await langFrom(props)
  return (
    <>
      <Hero lang={lang} />
      <Work lang={lang} />
      <Services lang={lang} />
      <Products lang={lang} />
      <CtaCard lang={lang} />
    </>
  )
}
