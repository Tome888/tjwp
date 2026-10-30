"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import type { Dict } from "@/i18n/en"
import { Rise } from "@/components/motion/rise"

export function NotFoundView({ t }: { t: Record<"en" | "mk", Dict["notFound"]> }) {
  const { lang } = useParams<{ lang?: string }>()
  const copy = lang === "mk" ? t.mk : t.en
  return (
    <section className="wrap page-head min-h-[70svh]">
      <p className="footnote">404</p>
      <Rise as="h1" on="load" text={copy.title} className="large-title mt-3" />
      <p className="lead mt-6">{copy.text}</p>
      <Link href="/" className="btn btn--ink mt-10">
        {copy.back}
      </Link>
    </section>
  )
}
