"use client"

import { useEffect, useRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

/*
 * Liquid glass.
 *
 * Browsers can't bend what's behind an element (Safari ignores SVG filters
 * in backdrop-filter), so each piece of glass holds two live copies of the
 * page, lined up with what's really behind it:
 *   - rim:  slightly magnified and sharp, so the edges bend the content
 *   - core: blurred, faded in from the edges, so text on the glass reads well
 * Both are cut to the glass's own size, so the blur only costs that area.
 * Fixed glass (top bar, tab bar) follows the scroll; glass inside the page
 * (the hero button) just sits on what's under it.
 *
 * Until the copies are ready, in Calm mode, with "reduce transparency" or
 * without JavaScript, CSS shows plain frosted glass instead.
 */

type Lens = {
  el: HTMLElement
  rim: HTMLElement
  /** Masked wrapper (soft edges) around `blur`, which holds the copy. */
  core: HTMLElement
  blur: HTMLElement
  fixed: boolean
  w: number
  h: number
  /** Fixed lenses: position in the viewport. Others: position in the page. */
  x: number
  y: number
}

// How strongly the rim bends content (magnification at the edges) and how
// much the blurred middle magnifies. The horizontal bend is capped so wide
// desktop bars don't pull in content from far away.
const RIM = 0.2
const RIM_MAX_X = 60
const CORE = 0.05
const CORE_MAX_X = 20

const lenses = new Set<Lens>()
let source: HTMLElement | null = null
let template: HTMLElement | null = null
let srcLeft = 0
let srcTop = 0
let srcWidth = 0
let running = false
let scrollFrame = 0
let rebuildTimer = 0
let measureTimer = 0
let mutations: MutationObserver | null = null
let resizes: ResizeObserver | null = null

function inGlassLayer(node: Node | null) {
  const el = node instanceof Element ? node : node?.parentElement
  return !!el?.closest("[data-glass-layer]")
}

/** A cleaned-up copy of the page: no ids, dialogs or nested glass layers. */
function makeTemplate(page: HTMLElement) {
  const copy = page.cloneNode(true) as HTMLElement
  copy.querySelectorAll("[data-glass-layer], dialog, script, noscript, [data-glass-skip]").forEach((n) => n.remove())
  copy.removeAttribute("id")
  copy.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"))
  copy.querySelectorAll("img").forEach((img) => {
    img.loading = "eager"
    img.decoding = "async"
  })
  copy.classList.add("glass-clone", "glass__clone")
  copy.setAttribute("aria-hidden", "true")
  copy.inert = true
  return copy
}

function attach(lens: Lens) {
  if (!template) return
  // Hidden glass (the tab bar on desktop) doesn't need a copy of the page.
  if (!lens.el.offsetWidth) {
    lens.rim.replaceChildren()
    lens.blur.replaceChildren()
    delete lens.el.dataset.live
    return
  }
  for (const layer of [lens.rim, lens.blur]) {
    const copy = template.cloneNode(true) as HTMLElement
    copy.style.width = `${srcWidth}px`
    layer.replaceChildren(copy)
  }
  lens.el.dataset.live = ""
}

function measure() {
  if (!source) return
  const r = source.getBoundingClientRect()
  srcLeft = r.left + scrollX
  srcTop = r.top + scrollY
  srcWidth = source.offsetWidth
  for (const lens of lenses) {
    const box = lens.el.getBoundingClientRect()
    lens.w = lens.el.offsetWidth
    lens.h = lens.el.offsetHeight
    // getBoundingClientRect includes a press scale; use the unscaled box.
    const vx = box.left + (box.width - lens.w) / 2
    const vy = box.top + (box.height - lens.h) / 2
    lens.x = lens.fixed ? vx : vx + scrollX - srcLeft
    lens.y = lens.fixed ? vy : vy + scrollY - srcTop
    const fx = Math.round(Math.min(lens.h * 0.36, 22))
    const fy = Math.round(lens.h * 0.2)
    const mask = `linear-gradient(90deg,transparent 0,#000 ${fx}px,#000 calc(100% - ${fx}px),transparent 100%),linear-gradient(180deg,transparent 0,#000 ${fy}px,#000 calc(100% - ${fy}px),transparent 100%)`
    // Kept on its own element: Safari mis-renders a mask and a filter on the
    // same element, so the blur lives one level down.
    const s = lens.core.style
    s.setProperty("-webkit-mask-image", mask)
    s.setProperty("mask-image", mask)
    s.setProperty("-webkit-mask-composite", "source-in")
    s.setProperty("mask-composite", "intersect")
    if (lens.el.dataset.live !== undefined) place(lens)
  }
}

function place(lens: Lens) {
  const { w, h } = lens
  if (!w || !h) return
  const ox = lens.fixed ? lens.x + scrollX - srcLeft : lens.x
  const oy = lens.fixed ? lens.y + scrollY - srcTop : lens.y
  const cx = w / 2
  const cy = h / 2
  const layers: Array<[HTMLElement, number, number]> = [
    [lens.rim, 1 + Math.min(RIM, (2 * RIM_MAX_X) / w), 1 + RIM],
    [lens.blur, 1 + Math.min(CORE, (2 * CORE_MAX_X) / w), 1 + CORE],
  ]
  for (const [layer, sx, sy] of layers) {
    const copy = layer.firstElementChild as HTMLElement | null
    if (!copy) continue
    copy.style.transform = `translate(${cx}px,${cy}px) scale(${sx},${sy}) translate(${-cx - ox}px,${-cy - oy}px)`
  }
}

function rebuild() {
  rebuildTimer = 0
  if (!source) return
  template = makeTemplate(source)
  measure()
  for (const lens of lenses) attach(lens)
  measure()
}

function scheduleRebuild(delay = 120) {
  if (rebuildTimer) clearTimeout(rebuildTimer)
  rebuildTimer = window.setTimeout(rebuild, delay)
}

function scheduleMeasure() {
  if (measureTimer) clearTimeout(measureTimer)
  measureTimer = window.setTimeout(() => {
    measureTimer = 0
    measure()
  }, 80)
}

function onScroll() {
  if (scrollFrame) return
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0
    for (const lens of lenses) if (lens.fixed) place(lens)
  })
}

function start() {
  if (running) return
  source = document.getElementById("page")
  if (!source) return
  running = true
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", () => scheduleRebuild(150), { passive: true })
  // Page content changed (navigation, filters, language): copy it again.
  mutations = new MutationObserver((list) => {
    if (list.every((m) => inGlassLayer(m.target))) return
    scheduleRebuild()
  })
  mutations.observe(source, { childList: true, subtree: true, characterData: true })
  // Layout shifted (images, fonts): just line the copies up again.
  resizes = new ResizeObserver(scheduleMeasure)
  resizes.observe(source)
  const go = () => {
    rebuild()
    document.fonts?.ready.then(() => scheduleRebuild(0))
  }
  if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 600 })
  else setTimeout(go, 200)
}

function register(lens: Lens) {
  lenses.add(lens)
  if (!running) start()
  else if (template) {
    attach(lens)
    measure()
  }
}

function unregister(lens: Lens) {
  lenses.delete(lens)
}

export function Glass({
  fixed = false,
  className,
  children,
  ...rest
}: { fixed?: boolean } & HTMLAttributes<HTMLDivElement>) {
  const root = useRef<HTMLDivElement>(null)
  const rim = useRef<HTMLDivElement>(null)
  const core = useRef<HTMLDivElement>(null)
  const blur = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current || !rim.current || !core.current || !blur.current) return
    const lens: Lens = {
      el: root.current,
      rim: rim.current,
      core: core.current,
      blur: blur.current,
      fixed,
      w: 0,
      h: 0,
      x: 0,
      y: 0,
    }
    register(lens)
    return () => unregister(lens)
  }, [fixed])

  return (
    <div ref={root} className={cn("glass", className)} {...rest}>
      <div ref={rim} className="glass__layer glass__rim" data-glass-layer aria-hidden="true" />
      <div ref={core} className="glass__layer glass__core" data-glass-layer aria-hidden="true">
        <div ref={blur} className="glass__blur" />
      </div>
      <span className="glass__tint" aria-hidden="true" />
      <span className="glass__hl" aria-hidden="true" />
      <div className="glass__ui">{children}</div>
    </div>
  )
}

/** Re-measure all glass, e.g. after something moved without a resize. */
export function refreshGlass() {
  if (running) measure()
}
