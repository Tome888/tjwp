import type { CSSProperties, ElementType } from "react"

type Vars = CSSProperties & Record<`--${string}`, string | number>

/**
 * A title whose words rise into place one after another.
 * `on="load"` runs once the page has loaded (for titles at the top);
 * `on="view"` waits until the title scrolls into view.
 * Only transform and opacity move, so it stays smooth on phones.
 */
export function Rise({
  text,
  as: Tag = "h2",
  on = "view",
  className,
  id,
}: {
  text: string
  as?: ElementType
  on?: "load" | "view"
  className?: string
  id?: string
}) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <Tag
      id={id}
      className={`rise ${on === "load" ? "rise--load" : ""} ${className ?? ""}`}
      data-reveal={on === "view" ? "" : undefined}
    >
      {words.map((w, i) => (
        <span key={i}>
          <span className="rise__w">
            <span style={{ "--i": i } as Vars}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  )
}
