"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import type { gsap as GSAP } from "gsap"
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger"

declare global {
  interface Window {
    __motionReady?: boolean
  }
}

/*
 * Two layers of motion:
 * 1. Reveals ([data-reveal]): an IntersectionObserver adds .is-in and CSS does
 *    the transition. No library, works with reduced motion (opacity only).
 * 2. Scroll-linked effects ([data-k]): GSAP + ScrollTrigger, loaded lazily once
 *    the browser is idle. Pinning is native `position: sticky`; GSAP only
 *    scrubs transforms and opacity.
 *
 * html[data-motion] is "full" or "reduced" (calm). It starts from the OS
 * setting and can be overridden with the Motion switch (see MotionToggle).
 * Calm mode keeps opacity-only effects and drops movement.
 */
export function MotionRoot({ lang }: { lang: string }) {
  const pathname = usePathname()

  useEffect(() => {
    window.__motionReady = true
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("is-in")
          io.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    )
    let frame = 0
    const scan = () => {
      frame = 0
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el))
    }
    scan()
    const mo = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan)
    })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  // Follow the Motion switch without a reload.
  const [mode, setMode] = useState<string | undefined>()
  useEffect(() => {
    const read = () => setMode(document.documentElement.dataset.motion)
    read()
    window.addEventListener("motionchange", read)
    return () => window.removeEventListener("motionchange", read)
  }, [])

  useEffect(() => {
    if (!mode) return
    if (!document.querySelector("[data-k]")) return

    let cancelled = false
    let revert: (() => void) | undefined

    const run = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const mm = gsap.matchMedia()
      mm.add({ wide: "(min-width: 1024px)", narrow: "(max-width: 1023px)" }, (context) => {
        const { wide } = context.conditions as Record<string, boolean>
        return setup(gsap, ScrollTrigger, wide, mode === "reduced")
      })
      document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh())
      revert = () => mm.revert()
    }

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(run, { timeout: 1200 })
      : window.setTimeout(run, 150)

    return () => {
      cancelled = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      revert?.()
    }
  }, [pathname, lang, mode])

  return null
}

function setup(gsap: typeof GSAP, ScrollTrigger: typeof ST, wide: boolean, calm: boolean) {
  const all = (selector: string) => gsap.utils.toArray<HTMLElement>(selector)
  const cleanups: Array<() => void> = []

  // Statement: words go from faint to full ink as you read down (opacity only,
  // so it also runs in calm mode).
  for (const el of all('[data-k="words"]')) {
    gsap.fromTo(
      el.querySelectorAll(".wd"),
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: true },
      },
    )
  }
  if (calm) {
    ScrollTrigger.refresh()
    return () => {}
  }

  // Hero: the two name lines drift apart, the portrait lifts, details fade.
  for (const hero of all('[data-k="hero"]')) {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    })
    hero.querySelectorAll<HTMLElement>("[data-k-line]").forEach((line) => {
      const dir = Number(line.dataset.kLine) || 1
      tl.to(line, { xPercent: dir * (wide ? 16 : 9) }, 0)
    })
    const portrait = hero.querySelector("[data-k-portrait]")
    if (portrait) tl.to(portrait, { yPercent: wide ? -22 : -10, scale: 0.94 }, 0)
    const fade = hero.querySelectorAll("[data-k-fade]")
    if (fade.length) tl.to(fade, { opacity: 0, y: -30 }, 0)
  }

  // Horizontal drift against the scroll (product names, skill rows, headings).
  for (const el of all('[data-k="drift"]')) {
    const amount = (Number(el.dataset.kAmount) || 10) * (wide ? 1 : 0.5)
    gsap.fromTo(
      el,
      { xPercent: amount },
      {
        xPercent: -amount,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      },
    )
  }

  // Headlines that grow into place.
  for (const el of all('[data-k="scale"]')) {
    gsap.fromTo(
      el,
      { scale: wide ? 0.78 : 0.9, transformOrigin: "0% 100%" },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true },
      },
    )
  }

  // Footer wordmark rises as the page ends.
  for (const el of all('[data-k="rise"]')) {
    gsap.fromTo(
      el,
      { yPercent: 45 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true },
      },
    )
  }

  // Selected work: chapters pinned with CSS sticky, transitions scrubbed.
  if (wide) {
    for (const el of all('[data-k="chapters"]')) cleanups.push(chapters(gsap, el))
  }

  ScrollTrigger.refresh()
  return () => cleanups.forEach((fn) => fn())
}

function chapters(gsap: typeof GSAP, el: HTMLElement) {
  const items = Array.from(el.querySelectorAll<HTMLElement>("[data-chapter]"))
  const n = items.length
  if (n < 2) return () => {}

  el.classList.add("is-pinned")
  const pick = (root: HTMLElement, s: string) => root.querySelectorAll<HTMLElement>(s)
  const tl = gsap.timeline({
    defaults: { ease: "power3.inOut" },
    scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
  })

  for (let i = 1; i < n; i++) {
    const prev = items[i - 1]
    const cur = items[i]
    const at = i - 1 + 0.3
    tl.to(pick(prev, "[data-ch-title] .c"), { yPercent: -120, stagger: { amount: 0.12 }, duration: 0.3 }, at)
      .to(pick(prev, "[data-ch-body]"), { autoAlpha: 0, y: -20, duration: 0.25 }, at)
      .fromTo(pick(cur, "[data-ch-frame]"), { yPercent: 101 }, { yPercent: 0, duration: 0.55 }, at + 0.05)
      .fromTo(pick(cur, "[data-ch-img]"), { yPercent: -40, scale: 1.12 }, { yPercent: 0, scale: 1, duration: 0.55 }, at + 0.05)
      .fromTo(
        pick(cur, "[data-ch-title] .c"),
        { yPercent: 120 },
        { yPercent: 0, stagger: { amount: 0.12 }, duration: 0.3 },
        at + 0.3,
      )
      .fromTo(pick(cur, "[data-ch-body]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.4)
      .to(pick(el, "[data-ch-count]"), { yPercent: (-100 * i) / n, duration: 0.45 }, at + 0.05)
  }
  tl.fromTo(pick(el, "[data-ch-bar]"), { scaleX: 1 / n }, { scaleX: 1, ease: "none", duration: n - 0.4 }, 0)

  return () => el.classList.remove("is-pinned")
}
