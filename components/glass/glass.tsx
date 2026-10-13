"use client"

import { useEffect, useId, useRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

/*
 * Liquid glass, rendered by liquidGL (WebGPU/WebGL, works in Safari too).
 *
 * liquidGL snapshots #page and refracts it inside each piece of glass.
 * Until it's running, in Calm mode, with "reduce transparency", without
 * JavaScript or without a GPU, CSS shows plain frosted glass instead.
 *
 * The tint of each piece of glass comes from its CSS `--lgl-tint`, so the
 * themes (and the hero button, which always sits on a light photo) set it
 * in globals.css.
 */

type LiquidLens = { destroy(): void; setTint?(tint: string | null): void }
type LiquidGL = ((options: Record<string, unknown>) => LiquidLens | LiquidLens[] | undefined) & {
  registerDynamic(elements: unknown): void
}

let lib: Promise<LiquidGL | undefined> | null = null
const load = () => (lib ||= import("liquid-gl").then((m) => m.default as LiquidGL | undefined))

/** The look of the glass. Tuned to match the approved preview. */
const LOOK = {
  snapshot: "#page",
  resolution: 1.5,
  refraction: 0.02,
  bevelDepth: 0.07,
  bevelWidth: 0.24,
  aberration: 0,
  frost: 0,
  shadow: false, // the CSS shadow is cleaner, especially in dark mode
  specular: true,
  reveal: "fade",
}

function glassAllowed() {
  const root = document.documentElement
  if (root.dataset.motion === "reduced") return false
  return !window.matchMedia("(prefers-reduced-transparency: reduce)").matches
}

function tintOf(el: HTMLElement) {
  return getComputedStyle(el).getPropertyValue("--lgl-tint").trim() || null
}

/*
 * Page content changed (navigation, language, theme, reveal animations):
 * liquidGL needs a fresh snapshot. registerDynamic([]) re-captures every
 * renderer without adding anything to watch.
 */
let watching = false
let recaptureTimer = 0
function recapture() {
  if (recaptureTimer) clearTimeout(recaptureTimer)
  recaptureTimer = window.setTimeout(async () => {
    recaptureTimer = 0
    const liquidGL = await load()
    liquidGL?.registerDynamic([])
  }, 250)
}
function watchPage() {
  if (watching) return
  const page = document.getElementById("page")
  if (!page) return
  watching = true
  new MutationObserver((list) => {
    if (list.every((m) => (m.target instanceof Element ? m.target : m.target.parentElement)?.closest(".glass"))) return
    recapture()
  }).observe(page, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class", "style", "data-revealed", "src"] })
  new MutationObserver(recapture).observe(document.documentElement, { attributes: true, attributeFilter: ["class", "lang"] })
}

export function Glass({
  fixed: _fixed,
  className,
  children,
  ...rest
}: { fixed?: boolean } & HTMLAttributes<HTMLDivElement>) {
  const root = useRef<HTMLDivElement>(null)
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "")

  useEffect(() => {
    const el = root.current
    if (!el) return
    let lens: LiquidLens | null = null
    let starting = false
    let gone = false

    const off = () => {
      lens?.destroy()
      lens = null
      delete el.dataset.live
    }

    const on = async () => {
      if (lens || starting) return
      starting = true
      const liquidGL = await load()
      starting = false
      if (gone || lens || !liquidGL || !glassAllowed() || !el.offsetWidth) return
      const made = liquidGL({ ...LOOK, target: `[data-lgl="${id}"]`, tint: tintOf(el) })
      lens = (Array.isArray(made) ? made[0] : made) ?? null
      if (lens) el.dataset.live = ""
      watchPage()
    }

    const sync = () => (glassAllowed() && el.offsetWidth ? on() : off())

    // Calm mode on/off, and theme changes (new tint).
    const htmlWatch = new MutationObserver(() => {
      sync()
      lens?.setTint?.(tintOf(el))
    })
    htmlWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion", "class"] })
    const transparency = window.matchMedia("(prefers-reduced-transparency: reduce)")
    transparency.addEventListener("change", sync)
    // Hidden glass (the tab bar on desktop) appears or disappears.
    const size = new ResizeObserver(sync)
    size.observe(el)

    // Let the page settle (fonts, first paint) before the first snapshot.
    const start = () => document.fonts?.ready.then(sync) ?? sync()
    const hasIdle = typeof window.requestIdleCallback === "function"
    const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 800 }) : window.setTimeout(start, 300)

    return () => {
      gone = true
      if (hasIdle) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      htmlWatch.disconnect()
      transparency.removeEventListener("change", sync)
      size.disconnect()
      off()
    }
  }, [id])

  return (
    <div ref={root} data-lgl={id} className={cn("glass", className)} {...rest}>
      <div className="glass__ui">{children}</div>
    </div>
  )
}

/** Kept for callers that moved glass without a resize; liquidGL tracks this itself. */
export function refreshGlass() {}
