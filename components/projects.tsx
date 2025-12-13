"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

interface Project {
  id: string
  tags: string[]
  title: string
  src: string
  ctaLink: string
  content: string
  description: string
}

interface ProjectsProps {
  data: {
    title: string
    projectsArr: Project[]
  }
}

export function Projects({ data }: ProjectsProps) {
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
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

  const allTags = Array.from(new Set(data.projectsArr.flatMap((project) => project.tags)))

  const filteredProjects =
    selectedTag === "all" ? data.projectsArr : data.projectsArr.filter((project) => project.tags.includes(selectedTag))

  return (
    <section ref={sectionRef} className="py-20 px-4 border-t border-border/40">
      <div className="container mx-auto max-w-6xl">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">{data.title}</h2>

          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <Button
              variant={selectedTag === "all" ? "default" : "outline"}
              onClick={() => setSelectedTag("all")}
              className="transition-all duration-300"
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                onClick={() => setSelectedTag(tag)}
                className="transition-all duration-300"
              >
                {tag}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <Card
                key={project.id}
                className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.src || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                <DialogDescription className="sr-only">Project details for {selectedProject.title}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={selectedProject.src || "/placeholder.svg"}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">{selectedProject.content}</p>
                <Button asChild className="w-full gap-2 group">
                  <a href={selectedProject.ctaLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Visit Project
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
