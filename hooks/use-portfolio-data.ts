"use client"

import { useState, useEffect } from "react"

export function usePortfolioData() {
  const [data, setData] = useState<any>(null)
  const [language, setLanguage] = useState<"en" | "mk">("en")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://tome888.github.io/portfolio-api/db.json")
        const jsonData = await response.json()
        setData(jsonData)
      } catch (error) {
        console.error("Error fetching portfolio data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "en" | "mk"
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: "en" | "mk") => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  return { data, language, setLanguage: handleSetLanguage, loading }
}
