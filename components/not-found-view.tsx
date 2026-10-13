"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowRight } from "@phosphor-icons/react"
import type { Dict } from "@/i18n/en"

export function NotFoundView({ t }: { t: Record<"en" | "mk", Dict["notFound"]> }) {
  const { lang } = useParams<{ lang?: string }>()
  const copy = lang === "mk" ? t.mk : t.en
  return (
    <section className="wrap page-head min-h-[70svh]">
      <p className="eyebrow enter">404</p>
      <h1 className="large-title enter mt-2" data-large-title>
        {copy.title}
      </h1>
      <p className="lead enter mt-4">{copy.text}</p>
      <Link href="/" className="btn btn--fill enter mt-8">
        {copy.back}
        <ArrowRight weight="bold" aria-hidden="true" />
      </Link>
    </section>
  )
}
