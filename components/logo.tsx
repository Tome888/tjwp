/** The TJ mark, same drawing as /public/icon.svg (the favicon). */
export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="tj-shine" cx="0.22" cy="0.12" r="0.9">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.34" />
          <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tj-depth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.5" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="23" fill="#2741D6" />
      <rect width="100" height="100" rx="23" fill="url(#tj-depth)" />
      <rect width="100" height="100" rx="23" fill="url(#tj-shine)" />
      <rect
        x="0.75"
        y="0.75"
        width="98.5"
        height="98.5"
        rx="22.25"
        stroke="#FFFFFF"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <g transform="translate(50 50) scale(0.7) translate(-55 -52)">
        <path
          d="M55 15V75C55 83.2843 48.2843 90 40 90"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M35 40H75" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
        <circle cx="35" cy="25" r="6" fill="#FFFFFF" />
      </g>
    </svg>
  )
}
