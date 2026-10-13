"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    __motionReady?: boolean
  }
}

/*
 * Motion is CSS: springs on press, reveals as sections scroll in, sheets
 * that slide up. This component only does two small jobs:
 * 1. Reveals ([data-reveal]): an IntersectionObserver adds .is-in and CSS
 *    runs the transition (opacity only in Calm mode).
 * 2. Keeps html[data-motion] ("full" or "reduced"/Calm) in place. It is set
 *    before first paint by the boot script in the layout and can be changed
 *    with the Motion switch (see MotionToggle).
 */
export function MotionRoot() {
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
      { rootMargin: "0px 0px -6% 0px" },
    )
    let frame = 0
    const scan = () => {
      frame = 0
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
        if (!el.closest(".glass-clone")) io.observe(el)
      })
    }
    scan()
    const page = document.getElementById("page") ?? document.body
    const mo = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan)
    })
    mo.observe(page, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  // Switching language re-renders the root layout, and React then strips
  // attributes it didn't set from <html>, including data-motion. The boot
  // script only runs on a full page load, so put the attribute back here.
  useEffect(() => {
    const root = document.documentElement
    const restore = () => {
      if (!root.dataset.motion) root.dataset.motion = preferredMotion()
    }
    restore()
    const watch = new MutationObserver(restore)
    watch.observe(root, { attributes: true, attributeFilter: ["data-motion"] })
    return () => watch.disconnect()
  }, [])

  return null
}

// Same rule as the boot script in the layout: the Motion switch wins,
// otherwise the OS "reduce motion" setting.
export function preferredMotion(): "full" | "reduced" {
  try {
    const saved = localStorage.getItem("motion")
    if (saved === "full" || saved === "reduced") return saved
  } catch {}
  try {
    return matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full"
  } catch {
    return "full"
  }
}
