"use client"

import { Moon, Sun, Languages, Menu, X } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = usePortfolioData()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const navigationLinks = [
    { href: "/", labelEn: "Home", labelMk: "Почетна" },
    { href: "/about", labelEn: "About", labelMk: "За мене" },
    { href: "/projects", labelEn: "Projects", labelMk: "Проекти" },
    { href: "/contact", labelEn: "Contact", labelMk: "Контакт" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg animate-in fade-in slide-in-from-top duration-500">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <nav className="hidden md:flex items-center gap-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive(link.href) ? "text-primary" : ""
              }`}
            >
              {language === "en" ? link.labelEn : link.labelMk}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Languages className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>English {language === "en" && "✓"}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("mk")}>
                Македонски {language === "mk" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-lg animate-in slide-in-from-top duration-300">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors ${
                  isActive(link.href) ? "bg-accent text-primary" : ""
                }`}
              >
                {language === "en" ? link.labelEn : link.labelMk}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
