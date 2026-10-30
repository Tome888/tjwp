"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import type { Dict } from "@/i18n/en"

export function NotFoundView({ t }: { t: Record<"en" | "mk", Dict["notFound"]> }) {
  const { lang } = useParams<{ lang?: string }>()
  const copy = lang === "mk" ? t.mk : t.en
  return (
    <section className="wrap page-head min-h-[70svh]">
      <p className="footnote">404</p>
      <h1 className="large-title mt-3">
        {copy.title}
      </h1>
      <p className="lead mt-6">{copy.text}</p>
      <Link href="/" className="btn btn--ink mt-10">
        {copy.back}
      </Link>
    </section>
  )
}
