import { langFrom, type LangParams } from "@/lib/i18n"
import { Hero } from "@/components/home/hero"
import { Products, Services, Statement } from "@/components/home/sections"
import { Chapters } from "@/components/home/chapters"
import { CtaBand } from "@/components/cta-band"

export default async function Home(props: LangParams) {
  const lang = await langFrom(props)
  return (
    <>
      <Hero lang={lang} />
      <Statement lang={lang} />
      <Services lang={lang} />
      <Products lang={lang} />
      <Chapters lang={lang} />
      <CtaBand lang={lang} />
    </>
  )
}
