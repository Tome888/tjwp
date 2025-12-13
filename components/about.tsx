"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Github } from "lucide-react"

interface AboutProps {
  data: {
    aboutText: string
    tech: Array<{ id: string; nameTech: string }>
    edu: Array<{ id: string; institute: string; title: string }>
    gitHubLink: string
    cvDownloadLink: string
  }
  language: "en" | "mk"
}

export function About({ data, language }: AboutProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-4 border-t border-border/40">
      <div className="container mx-auto max-w-6xl">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            {language === "en" ? "About Me" : "За мене"}
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{data.aboutText}</p>
            </Card>

            <div className="space-y-6">
              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4">{language === "en" ? "Technologies" : "Технологии"}</h3>
                <div className="flex flex-wrap gap-2">
                  {data.tech.map((tech, index) => (
                    <span
                      key={tech.id}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20 hover:bg-primary/20 transition-colors duration-300 animate-in fade-in slide-in-from-bottom"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {tech.nameTech}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4">{language === "en" ? "Education" : "Едукација"}</h3>
                <div className="space-y-4">
                  {data.edu.map((edu) => (
                    <div key={edu.id} className="border-l-2 border-primary/50 pl-4">
                      <h4 className="font-medium">{edu.title}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institute}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="gap-2 group">
              <a href={data.gitHubLink} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 group bg-transparent">
              <a href={data.cvDownloadLink} download>
                <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {language === "en" ? "Download CV" : "Преземи CV"}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
