import type { Metadata } from "next"
import Image from "next/image"
import type { CSSProperties } from "react"
import {
  ArrowUpRight,
  Certificate,
  DownloadSimple,
  FileArrowDown,
  GithubLogo,
  GraduationCap,
  LinkedinLogo,
  MapPin,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr"
import { site } from "@/content/site"
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
        <h1 className="large-title enter" data-large-title>
          {t.title}
        </h1>
        <p className="lead enter mt-3" style={{ "--d": 1 } as Vars}>
          {profile.role[lang]}
        </p>
      </section>

      <section className="wrap section">
        <div className="about-grid">
          <div className="grid gap-4">
            <div className="portrait enter" style={{ "--d": 2 } as Vars}>
              <Image
                src={`/${profile.photo}`}
                alt={`${profile.firstName[lang]} ${profile.lastName[lang]}`}
                fill
                priority
                sizes="(min-width: 900px) 440px, 100vw"
                className="object-cover object-[50%_28%]"
              />
            </div>
            <dl className="list enter" style={{ "--d": 3 } as Vars}>
              <div className="list__row">
                <span className="icon-tile icon-tile--sm" style={{ background: "var(--accent-fill)" }} aria-hidden="true">
                  <UserCircle weight="fill" />
                </span>
                <div className="list__main">
                  <dt className="footnote">{t.role}</dt>
                  <dd className="list__title">{profile.role[lang]}</dd>
                </div>
              </div>
              <div className="list__row">
                <span className="icon-tile icon-tile--sm" style={{ background: "var(--green)" }} aria-hidden="true">
                  <MapPin weight="fill" />
                </span>
                <div className="list__main">
                  <dt className="footnote">{t.location}</dt>
                  <dd className="list__title">{profile.location[lang]}</dd>
                </div>
              </div>
            </dl>
          </div>

          <article className="card story enter" style={{ "--d": 3 } as Vars} aria-label={t.storyLabel}>
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
        <div className="skills">
          {about.skills.map((g, i) => (
            <div key={i} className="card skill" data-reveal style={{ "--d": i % 3 } as Vars}>
              <h3 className="title-3">{g.group[lang]}</h3>
              <ul className="tags">
                {g.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="footnote mx-4 mt-3" data-reveal>
          {t.skillsNote}
        </p>
      </section>

      <section className="wrap section" aria-labelledby="edu-title">
        <SectionHead id="edu-title" title={t.educationLabel} />
        <ol className="list" data-reveal>
          {about.education.map((e, i) => {
            const Icon = i % 2 ? GraduationCap : Certificate
            return (
              <li key={i} className="list__row">
                <span
                  className="icon-tile icon-tile--sm"
                  style={{ background: i % 2 ? "var(--indigo)" : "var(--accent-fill)" }}
                  aria-hidden="true"
                >
                  <Icon weight="fill" />
                </span>
                <div className="list__main">
                  <p className="list__title">{e.title[lang]}</p>
                  <p className="list__sub">{e.institute[lang]}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="wrap section" aria-labelledby="links-title">
        <SectionHead id="links-title" title={t.linksLabel} />
        <ul className="list" data-reveal>
          <li>
            <a href={about.github} target="_blank" rel="noopener noreferrer" className="list__row">
              <span className="icon-tile icon-tile--sm" style={{ background: "#24292f" }} aria-hidden="true">
                <GithubLogo weight="fill" />
              </span>
              <span className="list__main list__title">GitHub</span>
              <ArrowUpRight className="list__trail" weight="bold" aria-hidden="true" />
            </a>
          </li>
          {linkedIn ? (
            <li>
              <a href={linkedIn.url} target="_blank" rel="noopener noreferrer" className="list__row">
                <span className="icon-tile icon-tile--sm" style={{ background: "#0a66c2" }} aria-hidden="true">
                  <LinkedinLogo weight="fill" />
                </span>
                <span className="list__main list__title">{linkedIn.label}</span>
                <ArrowUpRight className="list__trail" weight="bold" aria-hidden="true" />
              </a>
            </li>
          ) : null}
          <li>
            <a href={`/${about.cv[lang]}`} download className="list__row">
              <span className="icon-tile icon-tile--sm" style={{ background: "var(--green)" }} aria-hidden="true">
                <FileArrowDown weight="fill" />
              </span>
              <span className="list__main list__title">{t.cv}</span>
              <DownloadSimple className="list__trail" weight="bold" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </section>

      <CtaCard lang={lang} />
    </>
  )
}
