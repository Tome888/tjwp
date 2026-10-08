import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { preload } from "react-dom"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "next-themes"
import { site } from "@/content/site"
import { getDict, langFrom, LANGS, type LangParams } from "@/lib/i18n"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MotionRoot } from "@/components/motion/motion-root"
import "../globals.css"

// Fonts are self-hosted (see globals.css). Preload exactly the files the
// current language needs above the fold, so text never waits or reflows.
const preloadFonts = {
  en: ["onest-latin.woff2", "playfair-en-normal.woff2", "playfair-en-italic.woff2"],
  mk: ["onest-latin.woff2", "onest-cyrillic.woff2", "playfair-mk-normal.woff2", "playfair-mk-italic.woff2"],
}

// Runs before first paint: decides full vs reduced motion so nothing flashes.
// If the app never hydrates, content is shown unanimated after 4s.
const motionBoot = `(function(){var d=document.documentElement;try{d.dataset.motion=matchMedia("(prefers-reduced-motion: reduce)").matches?"reduced":"full"}catch(e){}setTimeout(function(){if(!window.__motionReady)d.removeAttribute("data-motion")},4000)})()`

// Every page exists once per language, prerendered at build time.
export const dynamicParams = false
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata(props: LangParams): Promise<Metadata> {
  const lang = await langFrom(props)
  const t = getDict(lang).meta
  const name = `${site.profile.firstName[lang]} ${site.profile.lastName[lang]}`
  return {
    metadataBase: new URL("https://tjwp.vercel.app"),
    title: { default: t.title, template: `%s — ${name}` },
    description: t.description,
    openGraph: {
      title: t.title,
      description: t.description,
      siteName: name,
      type: "website",
      locale: lang === "mk" ? "mk_MK" : "en_US",
    },
    icons: {
      icon: [
        { url: "/tj-light.svg", media: "(prefers-color-scheme: light)" },
        { url: "/tj-dark.svg", media: "(prefers-color-scheme: dark)" },
        { url: "/tj-dark.svg", type: "image/svg+xml" },
      ],
      apple: "/tj-light.svg",
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eee8dc" },
    { media: "(prefers-color-scheme: dark)", color: "#15130f" },
  ],
}

export default async function RootLayout({ children, params }: LangParams & { children: ReactNode }) {
  const lang = await langFrom({ params })
  const t = getDict(lang)
  for (const file of preloadFonts[lang]) {
    preload(`/fonts/${file}`, { as: "font", type: "font/woff2", crossOrigin: "anonymous" })
  }

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body id="top">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a href="#main" className="skip">
            {t.nav.skip}
          </a>
          <SiteHeader
            lang={lang}
            t={t.nav}
            firstName={site.profile.firstName[lang]}
            lastName={site.profile.lastName[lang]}
          />
          <main id="main">{children}</main>
          <SiteFooter lang={lang} />
          <MotionRoot lang={lang} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
