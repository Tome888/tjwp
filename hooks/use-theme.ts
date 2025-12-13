"use client"

import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
  }, [])

  const toggleTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      toggleTheme(savedTheme)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      toggleTheme("dark")
    }
  }, [])

  return { theme, setTheme: toggleTheme }
}
