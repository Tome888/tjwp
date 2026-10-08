import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

type Vars = CSSProperties & Record<`--${string}`, string | number>

// Splitting into separate boxes drops the font's kerning; restore the pairs
// that visibly gap at display sizes (an overhanging capital before a letter).
const overhang = new Set(["T", "Т", "Г", "Y", "V", "W", "У", "F", "P", "Р"])
const kern = (prev: string | undefined, char: string) =>
  prev !== undefined && overhang.has(prev) && /\p{Ll}/u.test(char) ? "c k" : "c"

/**
 * Splits text for kinetic type. Screen readers get the plain text; the split
 * copy is aria-hidden. Each piece (.c) carries --i, its index, for staggered
 * CSS/GSAP motion. `by="word"` makes each word one piece: same effects, far
 * fewer DOM nodes for long headlines.
 */
export function Chars({
  text,
  className,
  start = 0,
  by = "char",
}: {
  text: string
  className?: string
  start?: number
  by?: "char" | "word"
}) {
  let i = start
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={cn("split", className)}>
        {words.map((word, wi) => (
          <span key={wi}>
            <span className="w">
              {by === "word" ? (
                <span className="c" style={{ "--i": i++ } as Vars}>
                  {word}
                </span>
              ) : (
                Array.from(word).map((char, ci, all) => (
                  <span key={ci} className={kern(all[ci - 1], char)} style={{ "--i": i++ } as Vars}>
                    {char}
                  </span>
                ))
              )}
            </span>
            {wi < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  )
}

/** Splits text into words only (used for the scroll-read statement). */
export function Words({ text, className }: { text: string; className?: string }) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={cn("split", className)}>
        {words.map((word, i) => (
          <span key={i}>
            <span className="wd">{word}</span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  )
}

export type ArrowDir = "right" | "out" | "down" | "up"

const arrowPaths: Record<ArrowDir, string> = {
  right: "M2 8h11M9 4l4 4-4 4",
  out: "M4 12 12 4M5.5 4H12v6.5",
  down: "M8 2v11M4 9l4 4 4-4",
  up: "M8 14V3M4 7l4-4 4 4",
}

/** Inline arrow (the text font has no arrow glyphs in its main subset). */
export function Arrow({ dir = "right", className }: { dir?: ArrowDir; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("arrow", `arrow--${dir}`, className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <path d={arrowPaths[dir]} />
    </svg>
  )
}

/**
 * Hover "roll": the text slides up and an identical copy (a text-shadow one
 * line below) rolls in after it. One element, transform only.
 */
export function Roll({ text, arrow, className }: { text: string; arrow?: ArrowDir; className?: string }) {
  return (
    <>
      <span className={cn("roll", className)}>
        <span className="roll__t">{text}</span>
      </span>
      {arrow ? <Arrow dir={arrow} /> : null}
    </>
  )
}
