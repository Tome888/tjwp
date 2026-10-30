import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "next-themes"
import { site } from "@/content/site"
import { getDict, langFrom, LANGS, type LangParams } from "@/lib/i18n"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MotionRoot } from "@/components/motion/motion-root"
import { Backdrop } from "@/components/backdrop"
import "../globals.css"

// Type: Unbounded for the name and titles, Onest for text. Both are
// self-hosted (see globals.css) and split by script, so a page only loads
// the Latin or Cyrillic files it actually uses.

// Runs before first paint: picks full or calm motion so nothing flashes.
// A choice made with the Motion switch wins; otherwise the OS setting.
// If the app never hydrates, content is shown unanimated after 4s.
const motionBoot = `(function(){var d=document.documentElement,s=null;try{s=localStorage.getItem("motion")}catch(e){}try{d.dataset.motion=s==="full"||s==="reduced"?s:matchMedia("(prefers-reduced-motion: reduce)").matches?"reduced":"full"}catch(e){}setTimeout(function(){if(!window.__motionReady)d.removeAttribute("data-motion")},4000)})()`

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
    // The TJ mark. iOS rounds the corners of the touch icon itself, so that
    // one is a plain square.
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: "/apple-icon.png",
    },
  }
}

export const viewport: Viewport = {
  // Lets the page run under the iPhone notch and home bar; the bars use
  // env(safe-area-inset-*) to stay clear of them.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f2ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1130" },
  ],
}

export default async function RootLayout({ children, params }: LangParams & { children: ReactNode }) {
  const lang = await langFrom({ params })
  const t = getDict(lang)

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
          <Backdrop />
          <div id="page">
            <main id="main">{children}</main>
            <SiteFooter lang={lang} />
          </div>
          <MotionRoot />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
