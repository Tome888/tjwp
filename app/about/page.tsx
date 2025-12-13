"use client"

import { About } from "@/components/about"
import { AnimatedBackground } from "@/components/animated-background"
import { Spinner } from "@/components/ui/spinner"
import { usePortfolioData } from "@/hooks/use-portfolio-data"

export default function AboutPage() {
  const { data, language, loading } = usePortfolioData()

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  const currentData = data[language]

  return (
    <>
      <AnimatedBackground />
      <main className="relative z-10 pt-16">
        <About data={currentData.about} language={language} />
      </main>
    </>
  )
}
