import type { Metadata } from "next"
import Image from "next/image"
import type { CSSProperties } from "react"
import { ArrowUpRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr"
import { site } from "@/content/site"
import { Rise } from "@/components/motion/rise"
import { getDict, langFrom, type LangParams } from "@/lib/i18n"
import { SectionHead } from "@/components/home/sections"
import { CtaCard } from "@/components/cta-card"

type Vars = CSSProperties & Record<`--${string}`, string | number>

export async function generateMetadata(props: LangParams): Promise<Metadata> {
  const t = getDict(await langFrom(props)).meta
  return { title: t.about, description: t.aboutDescription }
}

export default async function AboutPage(props: LangParams) {
  const lang = await langFrom(props)
  const t = getDict(lang).about
  const { profile, about, contact } = site
  const linkedIn = contact.links.find((l) => /linkedin/i.test(l.label))
  const [first, ...rest] = about.paragraphs

  return (
    <>
      <section className="wrap page-head">
        <Rise as="h1" on="load" text={t.title} className="large-title" />
      </section>

      <section className="wrap pb-14 md:pb-22">
        <div className="about-grid">
          <div>
            <div className="portrait enter">
              <Image
                src={`/${profile.photo}`}
                alt={`${profile.firstName[lang]} ${profile.lastName[lang]}`}
                fill
                priority
                sizes="(min-width: 900px) 420px, 62vw"
                className="object-cover object-[50%_20%]"
              />
            </div>
            <dl className="facts enter" style={{ "--d": 1 } as Vars}>
              <div>
                <dt>{t.role}</dt>
                <dd>{profile.role[lang]}</dd>
              </div>
              <div>
                <dt>{t.location}</dt>
                <dd>{profile.location[lang]}</dd>
              </div>
              <div>
                <dt>{t.citizenship}</dt>
                <dd>{profile.citizenship[lang]}</dd>
              </div>
            </dl>
          </div>

          <article className="story enter" style={{ "--d": 1 } as Vars} aria-label={t.storyLabel}>
            {first ? <p className="story__lead">{first[lang]}</p> : null}
            {rest.map((p, i) => (
              <p key={i} className="story__body">
                {p[lang]}
              </p>
            ))}
          </article>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="skills-title">
        <SectionHead id="skills-title" title={t.skillsLabel} />
        <dl className="skills" data-reveal>
          {about.skills.map((g, i) => (
            <div key={i}>
              <dt>{g.group[lang]}</dt>
              <dd>{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
        <p className="footnote mt-5 max-w-[36em]">{t.skillsNote}</p>
      </section>

      <section className="wrap section" aria-labelledby="edu-title">
        <SectionHead id="edu-title" title={t.educationLabel} />
        <ol className="rows" data-reveal>
          {about.education.map((e, i) => (
            <li key={i} className="row">
              <div className="row__main">
                <p className="row__title">{e.title[lang]}</p>
                <p className="row__sub">{e.institute[lang]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap section" aria-labelledby="links-title">
        <SectionHead id="links-title" title={t.linksLabel} />
        <ul className="rows" data-reveal>
          <li>
            <a href={about.github} target="_blank" rel="noopener noreferrer" className="row">
              <span className="row__main row__title">GitHub</span>
              <ArrowUpRight className="row__trail" weight="bold" aria-hidden="true" />
            </a>
          </li>
          {linkedIn ? (
            <li>
              <a href={linkedIn.url} target="_blank" rel="noopener noreferrer" className="row">
                <span className="row__main row__title">{linkedIn.label}</span>
                <ArrowUpRight className="row__trail" weight="bold" aria-hidden="true" />
              </a>
            </li>
          ) : null}
          <li>
            <a href={`/${about.cv[lang]}`} download className="row">
              <span className="row__main row__title">{t.cv}</span>
              <DownloadSimple className="row__trail" weight="bold" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </section>

      <CtaCard lang={lang} />
    </>
  )
}
