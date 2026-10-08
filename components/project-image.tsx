"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Project/product image that fills its (aspect-ratio) parent.
 * A missing file or a typo in the filename falls back to a typographic plate
 * instead of a broken image.
 */
export function ProjectImage({
  src,
  title,
  sizes,
  priority,
  className,
}: {
  src?: string
  title: string
  sizes: string
  priority?: boolean
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    const initials = title
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => Array.from(w)[0])
      .join("")
    return (
      <span className={cn("plate", className)} role="img" aria-label={title}>
        <span className="display plate__mark">{initials}</span>
        <span className="plate__name">{title}</span>
      </span>
    )
  }

  return (
    <Image
      src={src}
      alt={title}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover object-top", className)}
      onError={() => setFailed(true)}
    />
  )
}
