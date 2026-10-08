import type { Metadata } from "next"
import Image from "next/image"
import type { CSSProperties } from "react"
import { site } from "@/content/site"
import { getDict, langFrom, type LangParams } from "@/lib/i18n"
import { pad } from "@/lib/content"
import { Arrow, Chars, Roll } from "@/components/motion/kinetic"
import { SectionLabel } from "@/components/home/sections"
import { CtaBand } from "@/components/cta-band"

export async function generateMetadata(props: LangParams): Promise<Metadata> {
  const t = getDict(await langFrom(props)).meta
  return { title: t.about, description: t.aboutDescription }
}

export default async function AboutPage(props: LangParams) {
  const lang = await langFrom(props)
  const t = getDict(lang).about
  const { profile, about, contact } = site
  // The drifting rows are the visual; the grouped list below is for reading.
  const allSkills = about.skills.flatMap((g) => g.items)
  const half = Math.ceil(allSkills.length / 2)
  const rows = [allSkills.slice(0, half), allSkills.slice(half)].filter((r) => r.length)
  const linkedIn = contact.links.find((l) => /linkedin/i.test(l.label))

  return (
    <>
      <section className="wrap page-head grid12">
        <h1
          className="display page-title intro col-span-4 md:col-span-8 lg:col-span-12"
          style={{ "--len": Array.from(t.title).length } as CSSProperties}
        >
          <Chars text={t.title} className="mask kinetic" />
        </h1>
        <p className="display about-role intro-fade col-span-4 md:col-span-6 md:col-start-3 lg:col-span-7 lg:col-start-6">
          <em>{profile.role[lang]}</em>
        </p>
      </section>

      <section className="wrap section grid12 !pt-0">
        <aside className="about-aside col-span-4 md:col-span-3 lg:col-span-3">
          <div className="about-portrait" data-reveal>
            <Image
              src={`/${profile.photo}`}
              alt={`${profile.firstName[lang]} ${profile.lastName[lang]}`}
              fill
              priority
              sizes="(min-width: 1024px) 22vw, (min-width: 768px) 34vw, 60vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <dl className="facts" data-reveal>
            <div>
              <dt className="label">{t.role}</dt>
              <dd>{profile.role[lang]}</dd>
            </div>
            <div>
              <dt className="label">{t.location}</dt>
              <dd>{profile.location[lang]}</dd>
            </div>
          </dl>
        </aside>
        <div className="col-span-4 mt-14 md:col-span-5 md:mt-0 lg:col-span-7 lg:col-start-6">
          <SectionLabel index={1}>{t.storyLabel}</SectionLabel>
          {about.paragraphs.map((p, i) => (
            <p key={i} data-reveal className={i === 0 ? "display about-lead" : "about-body"}>
              {p[lang]}
            </p>
          ))}
        </div>
      </section>

      <section className="section skills !pt-0" aria-labelledby="skills-label">
        <div className="wrap">
          <SectionLabel index={2} id="skills-label" as="h2">
            {t.skillsLabel}
          </SectionLabel>
        </div>
        <div className="skills__rows" aria-hidden="true">
          {rows.map((row, r) => (
            <div key={r} className="skills__track">
              <div
                data-k="drift"
                data-k-amount={r % 2 ? -7 : 7}
                className="display skills__row"
                style={{ "--amount": r % 2 ? -7 : 7 } as CSSProperties}
              >
                {[...row, ...row, ...row].map((s, i) => (
                  <span key={i}>
                    {r % 2 ? <em>{s}</em> : s}
                    <span className="skills__sep">/</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="wrap">
          <div className="stack">
            {about.skills.map((g, i) => (
              <div key={i} className="stack__group" data-reveal style={{ "--d": i } as CSSProperties}>
                <h3 className="label">{g.group[lang]}</h3>
                <ul>
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="stack__note" data-reveal>
            {t.skillsNote}
          </p>
        </div>
      </section>

      <section className="wrap section grid12 !pt-0" aria-labelledby="edu-label">
        <div className="col-span-4 md:col-span-2 lg:col-span-3">
          <SectionLabel index={3} id="edu-label" as="h2">
            {t.educationLabel}
          </SectionLabel>
        </div>
        <ol className="ledger col-span-4 md:col-span-6 lg:col-span-9">
          {about.education.map((e, i) => (
            <li key={i} data-reveal style={{ "--d": i } as CSSProperties}>
              <span className="label">{pad(i + 1)}</span>
              <span className="display ledger__title">{e.title[lang]}</span>
              <span className="ledger__meta">{e.institute[lang]}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap section grid12 !pt-0" aria-labelledby="links-label">
        <div className="col-span-4 md:col-span-2 lg:col-span-3">
          <SectionLabel index={4} id="links-label" as="h2">
            {t.linksLabel}
          </SectionLabel>
        </div>
        <ul className="big-links col-span-4 md:col-span-6 lg:col-span-9">
          <li data-reveal>
            <a href={about.github} target="_blank" rel="noopener noreferrer" className="roll-host">
              <Roll text="GitHub" />
              <Arrow dir="out" className="big-links__arrow" />
            </a>
          </li>
          {linkedIn ? (
            <li data-reveal>
              <a href={linkedIn.url} target="_blank" rel="noopener noreferrer" className="roll-host">
                <Roll text={linkedIn.label} />
                <Arrow dir="out" className="big-links__arrow" />
              </a>
            </li>
          ) : null}
          <li data-reveal>
            <a href={`/${about.cv[lang]}`} download className="roll-host">
              <Roll text={t.cv} />
              <Arrow dir="down" className="big-links__arrow" />
            </a>
          </li>
        </ul>
      </section>

      <CtaBand lang={lang} />
    </>
  )
}
