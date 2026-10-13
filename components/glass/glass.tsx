"use client"

import { useEffect, useId, useRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

/*
 * Liquid glass, rendered by liquidGL (WebGPU/WebGL, works in Safari too).
 *
 * liquidGL snapshots the page and refracts it inside each piece of glass.
 * Until it's running, in Calm mode, with "reduce transparency", without
 * JavaScript or without a GPU, CSS shows plain frosted glass instead.
 *
 * Snapshots are the expensive part (the whole page is redrawn into a
 * texture), so they're kept rare: only when content really changed, never
 * while scrolling, and at a modest resolution. On a theme change the old
 * snapshot would show the wrong colours until a new one is ready, so the
 * glass drops to frosted for a moment and comes back with a fresh one.
 *
 * The tint of each piece of glass comes from its CSS `--lgl-tint` and the
 * milky middle from `--glass-fill` (see globals.css).
 */

type LiquidLens = { destroy(): void }
type LiquidGL = ((options: Record<string, unknown>) => LiquidLens | LiquidLens[] | undefined) & {
  registerDynamic(elements: unknown): void
}

let lib: Promise<LiquidGL | undefined> | null = null
const load = () => (lib ||= import("liquid-gl").then((m) => m.default as LiquidGL | undefined))

/** The look of the glass. */
const LOOK = {
  resolution: 1,
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
  if (document.documentElement.dataset.motion === "reduced") return false
  return !window.matchMedia("(prefers-reduced-transparency: reduce)").matches
}

function tintOf(el: HTMLElement) {
  return getComputedStyle(el).getPropertyValue("--lgl-tint").trim() || null
}

/* ── Shared state for all glass on the page ─────────────────────────────── */

type Control = { sync(): void; off(): void }
const controls = new Set<Control>()

let watching = false
let lastScroll = 0
let lastCapture = 0
/** At most one snapshot this often; each one briefly busies the phone. */
const MIN_GAP = 2000
let recaptureTimer = 0
let themeTimer = 0

/** Take a fresh snapshot once things are quiet (never mid-scroll). */
function recapture(delay = 500) {
  if (recaptureTimer) clearTimeout(recaptureTimer)
  recaptureTimer = window.setTimeout(async () => {
    recaptureTimer = 0
    if (performance.now() - lastScroll < 300) return recapture(300)
    // A project sheet covers the page; nothing to refract until it closes.
    if (document.documentElement.classList.contains("sheet-open")) return recapture(800)
    const wait = MIN_GAP - (performance.now() - lastCapture)
    if (wait > 0) return recapture(wait)
    lastCapture = performance.now()
    const liquidGL = await load()
    // registerDynamic([]) re-captures every renderer without adding anything.
    liquidGL?.registerDynamic([])
  }, delay)
}

/** Theme switched: frosted now, fresh glass once the new colours are in. */
function themeChanged() {
  for (const c of controls) c.off()
  if (themeTimer) clearTimeout(themeTimer)
  themeTimer = window.setTimeout(() => {
    themeTimer = 0
    for (const c of controls) c.sync()
  }, 450)
}

function watch() {
  if (watching) return
  watching = true
  const root = document.documentElement
  let dark = root.classList.contains("dark")

  window.addEventListener("scroll", () => (lastScroll = performance.now()), { passive: true })

  new MutationObserver(() => {
    const nowDark = root.classList.contains("dark")
    if (nowDark !== dark) {
      dark = nowDark
      themeChanged()
    } else if (!themeTimer) {
      for (const c of controls) c.sync() // Calm mode on/off
    }
  }).observe(root, { attributes: true, attributeFilter: ["class", "data-motion"] })

  // Content changed (navigation, language, filters, reveals). Changes inside
  // the glass itself (the sliding selection) or a sheet don't count.
  const page = document.getElementById("page")
  if (page) {
    new MutationObserver((list) => {
      const outside = list.some((m) => {
        const el = m.target instanceof Element ? m.target : m.target.parentElement
        return !el?.closest(".glass, dialog")
      })
      if (outside) recapture()
    }).observe(page, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class"] })
  }

  window.matchMedia("(prefers-reduced-transparency: reduce)").addEventListener("change", () => {
    for (const c of controls) c.sync()
  })
}

/* ── Component ──────────────────────────────────────────────────────────── */

export function Glass({
  fixed: _fixed,
  snapshot = "#page",
  className,
  children,
  ...rest
}: {
  fixed?: boolean
  /** What the glass refracts. Smaller is cheaper (the hero button only needs its photo). */
  snapshot?: string
} & HTMLAttributes<HTMLDivElement>) {
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
      const made = liquidGL({ ...LOOK, snapshot, target: `[data-lgl="${id}"]`, tint: tintOf(el) })
      lens = (Array.isArray(made) ? made[0] : made) ?? null
      if (lens) el.dataset.live = ""
    }

    const sync = () => (glassAllowed() && el.offsetWidth && !themeTimer ? on() : off())
    const control: Control = { sync, off }
    controls.add(control)
    watch()

    // Hidden glass (the tab bar on desktop) appears or disappears.
    const size = new ResizeObserver(() => {
      if (!!el.offsetWidth !== !!lens) sync()
    })
    size.observe(el)

    // Let the page settle (fonts, first paint) before the first snapshot.
    const start = () => document.fonts?.ready.then(sync) ?? sync()
    const hasIdle = typeof window.requestIdleCallback === "function"
    const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 800 }) : window.setTimeout(start, 300)

    return () => {
      gone = true
      if (hasIdle) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      controls.delete(control)
      size.disconnect()
      off()
    }
  }, [id, snapshot])

  return (
    <div ref={root} data-lgl={id} className={cn("glass", className)} {...rest}>
      <span className="glass__fill" aria-hidden="true" />
      <div className="glass__ui">{children}</div>
    </div>
  )
}

/** Kept for callers that moved glass without a resize; liquidGL tracks this itself. */
export function refreshGlass() {}
