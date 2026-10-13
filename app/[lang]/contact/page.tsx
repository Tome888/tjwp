import type { Metadata } from "next"
import type { CSSProperties } from "react"
import { ArrowUpRight, CalendarCheck, GithubLogo, LinkedinLogo, LinkSimple } from "@phosphor-icons/react/dist/ssr"
import { site } from "@/content/site"
import { getDict, langFrom, type LangParams } from "@/lib/i18n"
import { ContactForm, CopyEmail } from "@/components/contact/contact-form"

type Vars = CSSProperties & Record<`--${string}`, string | number>

export async function generateMetadata(props: LangParams): Promise<Metadata> {
  const t = getDict(await langFrom(props)).meta
  return { title: t.contact, description: t.contactDescription }
}

function linkLook(label: string) {
  if (/github/i.test(label)) return { Icon: GithubLogo, color: "#24292f" }
  if (/linkedin/i.test(label)) return { Icon: LinkedinLogo, color: "#0a66c2" }
  return { Icon: LinkSimple, color: "var(--gray)" }
}

export default async function ContactPage(props: LangParams) {
  const lang = await langFrom(props)
  const t = getDict(lang).contact
  const { contact, profile } = site

  return (
    <>
      <section className="wrap page-head">
        <h1 className="large-title enter" data-large-title>
          {t.title}
        </h1>
        <p className="lead enter mt-3" style={{ "--d": 1 } as Vars}>
          {t.lead}
        </p>
      </section>

      <section className="wrap section">
        <div className="contact-grid">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
            <div className="card email-card enter" style={{ "--d": 2 } as Vars}>
              <p className="footnote">{t.emailLabel}</p>
              <a href={`mailto:${contact.email}`} className="email-card__address">
                {contact.email}
              </a>
              <CopyEmail email={contact.email} t={t} />
            </div>

            <div className="enter" style={{ "--d": 3 } as Vars}>
              <p className="footnote form-group-label">{t.elsewhere}</p>
              <ul className="list">
                {contact.links.map((l) => {
                  const { Icon, color } = linkLook(l.label)
                  return (
                    <li key={l.url}>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="list__row">
                        <span className="icon-tile icon-tile--sm" style={{ background: color }} aria-hidden="true">
                          <Icon weight="fill" />
                        </span>
                        <span className="list__main list__title">{l.label}</span>
                        <ArrowUpRight className="list__trail" weight="bold" aria-hidden="true" />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            {profile.available ? (
              <p className="availability enter justify-self-start" style={{ "--d": 4 } as Vars}>
                <CalendarCheck weight="bold" aria-hidden="true" />
                {profile.availability[lang]}
              </p>
            ) : null}
          </div>

          <div className="enter min-w-0" style={{ "--d": 3 } as Vars}>
            <ContactForm t={t} />
          </div>
        </div>
      </section>
    </>
  )
}
