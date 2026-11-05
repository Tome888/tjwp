"use client"

import { useEffect, useState } from "react"
import type { Dict } from "@/i18n/en"

type Mode = "full" | "reduced"

/** Sets Full / Calm and remembers it on this device. */
export function setMotion(next: Mode) {
  document.documentElement.dataset.motion = next
  try {
    localStorage.setItem("motion", next)
  } catch {}
  window.dispatchEvent(new Event("motionchange"))
}

/** The current Full / Calm setting, kept in sync with html[data-motion]. */
export function useMotionMode() {
  const [mode, setMode] = useState<Mode | null>(null)
  useEffect(() => {
    const root = document.documentElement
    const read = () => setMode(root.dataset.motion === "reduced" ? "reduced" : "full")
    read()
    const watch = new MutationObserver(read)
    watch.observe(root, { attributes: true, attributeFilter: ["data-motion"] })
    return () => watch.disconnect()
  }, [])
  return mode
}

/**
 * Motion: Full / Calm. Calm turns the movement into quick fades. The choice
 * is remembered on this device; by default it follows the OS "reduce motion"
 * setting. The selected side is drawn by CSS from html[data-motion], so it
 * is right from the first paint.
 */
export function MotionToggle({ t }: { t: Dict["nav"] }) {
  const mode = useMotionMode()
  const choose = setMotion

  return (
    <div className="flex items-center">
      <span className="seg__label" id="motion-label">
        {t.motion}
      </span>
      <div role="group" aria-labelledby="motion-label" className="seg seg--motion">
        <button type="button" aria-pressed={mode ? mode === "full" : undefined} onClick={() => choose("full")}>
          {t.motionFull}
        </button>
        <button type="button" aria-pressed={mode ? mode === "reduced" : undefined} onClick={() => choose("reduced")}>
          {t.motionCalm}
        </button>
      </div>
    </div>
  )
}
