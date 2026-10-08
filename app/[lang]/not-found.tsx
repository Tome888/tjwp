import { en } from "@/i18n/en"
import { mk } from "@/i18n/mk"
import { NotFoundView } from "@/components/not-found-view"

// not-found doesn't receive route params, so the view picks the language
// on the client from the URL segment.
export default function NotFound() {
  return <NotFoundView t={{ en: en.notFound, mk: mk.notFound }} />
}
