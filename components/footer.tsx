"use client"

import { usePortfolioData } from "@/hooks/use-portfolio-data"

export function Footer() {
  const { data, language } = usePortfolioData()

  if (!data) return null

  const currentData = data[language]

  return (
    <footer className="relative z-10 border-t border-border py-8 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {currentData.home.name} {currentData.home.lastName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
