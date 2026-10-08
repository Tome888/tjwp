import { notFound } from "next/navigation"

// Any unknown path under a language renders the 404 page.
export default function CatchAll() {
  notFound()
}
