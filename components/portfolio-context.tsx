"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

type Language = "en" | "mk"

type PortfolioContextType = {
  data: any
  language: Language
  setLanguage: (lang: Language) => void
  loading: boolean
}

const PortfolioContext = createContext<PortfolioContextType | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<any>(null)
  const [language, setLanguageState] = useState<Language>("en")
  const [loading, setLoading] = useState(true)

  // Fetch portfolio data ONCE
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          "https://tome888.github.io/portfolio-api/db.json"
        )
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

  // Load saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  return (
    <PortfolioContext.Provider
      value={{
        data,
        language,
        setLanguage,
        loading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

// Custom hook to consume context (same DX as before)
export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error("usePortfolio must be used inside PortfolioProvider")
  }
  return context
}
