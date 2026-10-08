import type { Lang } from "@/content/types"
import { en } from "@/i18n/en"
import { mk } from "@/i18n/mk"

// Pages are prerendered once per language under /en and /mk. proxy.ts picks
// one from this cookie (or the browser language) and rewrites the visible
// URL (/about) to it, so links never show a language prefix.
export const LANG_COOKIE = "lang"
export const LANGS: Lang[] = ["en", "mk"]

const dictionaries = { en, mk }

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "mk"
}

export function getDict(lang: Lang) {
  return dictionaries[lang]
}

export type LangParams = { params: Promise<{ lang: string }> }

export async function langFrom({ params }: LangParams): Promise<Lang> {
  const { lang } = await params
  return isLang(lang) ? lang : "en"
}
