import type { Metadata } from "next"
import type { CSSProperties } from "react"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"
import { site } from "@/content/site"
import { getDict, langFrom, type LangParams } from "@/lib/i18n"
import { ContactForm, CopyEmail } from "@/components/contact/contact-form"

type Vars = CSSProperties & Record<`--${string}`, string | number>

export async function generateMetadata(props: LangParams): Promise<Metadata> {
  const t = getDict(await langFrom(props)).meta
  return { title: t.contact, description: t.contactDescription }
}

export default async function ContactPage(props: LangParams) {
  const lang = await langFrom(props)
  const t = getDict(lang).contact
  const { contact, profile } = site

  return (
    <>
      <section className="wrap page-head">
        <h1 className="large-title">{t.title}</h1>
        <p className="lead mt-6">{t.lead}</p>
      </section>

      <section className="wrap section !pt-6">
        <div className="contact-grid">
          <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-10">
            <div className="enter">
              <p className="footnote">{t.emailLabel}</p>
              <a href={`mailto:${contact.email}`} className="email-card__address">
                {contact.email}
              </a>
              <CopyEmail email={contact.email} t={t} />
            </div>

            <div className="enter" style={{ "--d": 1 } as Vars}>
              <p className="footnote form-group-label">{t.elsewhere}</p>
              <ul className="rows">
                {contact.links.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="row">
                      <span className="row__main row__title">{l.label}</span>
                      <ArrowUpRight className="row__trail" weight="bold" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {profile.available ? (
              <p className="status enter" style={{ "--d": 2 } as Vars}>
                {profile.availability[lang]}.
              </p>
            ) : null}
          </div>

          <div className="enter min-w-0" style={{ "--d": 1 } as Vars}>
            <ContactForm t={t} />
          </div>
        </div>
      </section>
    </>
  )
}
