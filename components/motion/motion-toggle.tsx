"use client"

import type { Dict } from "@/i18n/en"

/**
 * Switches between full and calm motion and remembers the choice on this
 * device. Defaults follow the OS "reduce motion" setting. The label is
 * driven by CSS from html[data-motion], so it never mismatches on hydration.
 */
export function MotionToggle({ t }: { t: Dict["nav"] }) {
  const flip = () => {
    const root = document.documentElement
    const next = root.dataset.motion === "reduced" ? "full" : "reduced"
    root.dataset.motion = next
    try {
      localStorage.setItem("motion", next)
    } catch {}
    window.dispatchEvent(new Event("motionchange"))
  }

  return (
    <button type="button" className="label-btn motion-toggle" onClick={flip}>
      <span className="motion-toggle__dot" aria-hidden="true" />
      {t.motion}:&nbsp;
      <span className="motion-toggle__full">{t.motionFull}</span>
      <span className="motion-toggle__calm">{t.motionCalm}</span>
    </button>
  )
}
