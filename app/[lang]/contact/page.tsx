import type { Metadata } from "next"
import type { CSSProperties } from "react"
import { site } from "@/content/site"
import { getDict, langFrom, type LangParams } from "@/lib/i18n"
import { Chars, Roll } from "@/components/motion/kinetic"
import { ContactForm, CopyEmail } from "@/components/contact/contact-form"

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
        <h1
          className="display page-title page-title--wrap intro"
          style={{ "--len": Math.min(Array.from(t.title).length, 10) } as CSSProperties}
        >
          <Chars text={t.title} className="mask kinetic" />
        </h1>
      </section>

      <section className="wrap section grid12 !pt-0">
        <div className="col-span-4 md:col-span-3 lg:col-span-4">
          <p className="contact-lead intro-fade">{t.lead}</p>

          <div className="contact-block" data-reveal>
            <p className="label">{t.emailLabel}</p>
            <a href={`mailto:${contact.email}`} className="contact-email roll-host">
              <Roll text={contact.email} />
            </a>
            <CopyEmail email={contact.email} t={t} />
          </div>

          <div className="contact-block" data-reveal>
            <p className="label">{t.elsewhere}</p>
            <ul className="space-y-1">
              {contact.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="link roll-host">
                    <Roll text={l.label} arrow="out" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {profile.available ? (
            <p className="label avail contact-block" data-reveal>
              <span className="avail__mark" aria-hidden="true" />
              {profile.availability[lang]}
            </p>
          ) : null}
        </div>

        <div className="col-span-4 mt-16 md:col-span-5 md:mt-0 lg:col-span-7 lg:col-start-6">
          <ContactForm t={t} />
        </div>
      </section>
    </>
  )
}
