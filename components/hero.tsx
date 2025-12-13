"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface HeroProps {
  data: {
    pfpImg: string
    name: string
    lastName: string
    status: string
    slogan: string
  }
}

export function Hero({ data }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <Image
                src={data.pfpImg || "/placeholder.svg"}
                alt={`${data.name} ${data.lastName}`}
                width={160}
                height={160}
                className="relative rounded-full border-4 border-border object-cover"
              />
            </div>
          </div>

          <div
            className={`space-y-4 transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              {data.name}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {data.lastName}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">{data.status}</p>
          </div>

          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-lg md:text-xl max-w-2xl text-balance text-muted-foreground">{data.slogan}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
