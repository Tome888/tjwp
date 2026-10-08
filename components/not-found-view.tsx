"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import type { CSSProperties } from "react"
import type { Dict } from "@/i18n/en"
import { Chars, Roll } from "@/components/motion/kinetic"

export function NotFoundView({ t }: { t: Record<"en" | "mk", Dict["notFound"]> }) {
  const { lang } = useParams<{ lang?: string }>()
  const copy = lang === "mk" ? t.mk : t.en
  return (
    <section className="wrap page-head min-h-[80svh]">
      <p className="label mb-6">404</p>
      <h1 className="display page-title page-title--wrap intro" style={{ "--len": 9 } as CSSProperties}>
        <Chars text={copy.title} className="mask kinetic" />
      </h1>
      <p className="page-lead intro-fade mt-10">{copy.text}</p>
      <Link href="/" className="btn btn--accent roll-host mt-10">
        <Roll text={copy.back} arrow="right" />
      </Link>
    </section>
  )
}
