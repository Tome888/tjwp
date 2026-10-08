import Link from "next/link"
import type { CSSProperties } from "react"
import type { Lang } from "@/content/types"
import { getDict } from "@/lib/i18n"
import { featuredProjects, imagePath, pad } from "@/lib/content"
import { Chars, Roll } from "@/components/motion/kinetic"
import { ProjectImage } from "@/components/project-image"
import { SectionLabel } from "./sections"

type Vars = CSSProperties & Record<`--${string}`, string | number>

/**
 * Selected work as chapters. On wide screens (with motion) the section pins
 * via CSS sticky and each scroll step swaps to the next project. Everywhere
 * else the chapters simply stack.
 */
export function Chapters({ lang, index = 4 }: { lang: Lang; index?: number }) {
  const t = getDict(lang).home
  const items = featuredProjects
  const n = items.length
  if (!n) return null

  return (
    <section
      id="work"
      className="chapters"
      data-k="chapters"
      style={{ "--n": n } as Vars}
      aria-labelledby="work-label"
    >
      <div className="chapters__viewport">
        <div className="wrap chapters__head">
          <SectionLabel index={index} id="work-label" as="h2">
            {t.workLabel}
          </SectionLabel>
          <div className="chapters__counter display" aria-hidden="true">
            <span className="chapters__count-mask">
              <span className="chapters__count-strip" data-ch-count>
                {items.map((_, i) => (
                  <span key={i}>{pad(i + 1)}</span>
                ))}
              </span>
            </span>
            <span className="chapters__total">/{pad(n)}</span>
          </div>
          <Link href="/projects" className="link roll-host chapters__all">
            <Roll text={t.allWork} arrow="right" />
          </Link>
        </div>
        <div className="wrap chapters__bar" aria-hidden="true">
          <span data-ch-bar />
        </div>

        <div className="wrap chapters__stage">
          {items.map((p, i) => {
            const title = p.title[lang]
            return (
              <article
                key={p.slug}
                data-chapter
                className="chapter"
                style={{ "--z": i, "--len": Math.max(Array.from(title).length, 8) } as Vars}
                aria-labelledby={`ch-${p.slug}`}
              >
                <div className="chapter__media" data-reveal>
                  <div className="chapter__frame" data-ch-frame>
                    <div className="chapter__img" data-ch-img>
                      <ProjectImage
                        src={imagePath(p.image)}
                        title={title}
                        sizes="(min-width: 1024px) 55vw, 92vw"
                      />
                    </div>
                  </div>
                </div>
                <div className="chapter__text">
                  <span className="chapter__num display" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <h3 id={`ch-${p.slug}`} data-ch-title data-reveal="mask" className="display chapter__title">
                    <Chars text={title} className="mask" by="word" />
                  </h3>
                  <div data-ch-body className="chapter__body">
                    <div data-reveal>
                      {p.role || p.status ? (
                        <p className="meta-line">
                          {p.role ? <span className="label">{p.role[lang]}</span> : null}
                          {p.status ? <span className="status">{p.status[lang]}</span> : null}
                        </p>
                      ) : null}
                      <p className="chapter__summary">{p.summary[lang]}</p>
                      <ul className="tags" aria-label={getDict(lang).projects.tags}>
                        {p.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-x-8 gap-y-3">
                        <Link href={`/projects#${p.slug}`} className="link roll-host">
                          <Roll text={t.details} arrow="right" />
                        </Link>
                        {p.link ? (
                          <a href={p.link} target="_blank" rel="noopener noreferrer" className="link roll-host">
                            <Roll text={t.visit} arrow="out" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
