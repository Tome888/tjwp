import { NextResponse, type NextRequest } from "next/server"

// Keeps public URLs language-free (/, /about, /projects, /contact) while the
// pages themselves are static files per language (/en/..., /mk/...).
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // /mk/about or /en → remember the choice, then show the clean URL.
  const prefixed = pathname.match(/^\/(en|mk)(\/.*)?$/)
  if (prefixed) {
    const url = request.nextUrl.clone()
    url.pathname = prefixed[2] || "/"
    const res = NextResponse.redirect(url)
    res.cookies.set("lang", prefixed[1], { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" })
    return res
  }

  const saved = request.cookies.get("lang")?.value
  const lang =
    saved === "en" || saved === "mk"
      ? saved
      : (request.headers.get("accept-language") ?? "").trim().toLowerCase().startsWith("mk")
        ? "mk"
        : "en"

  const url = request.nextUrl.clone()
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`
  url.search = search
  return NextResponse.rewrite(url)
}

export const config = {
  // Everything except Next internals, Vercel internals and files with an extension.
  matcher: ["/((?!_next/|_vercel/|.*\\.[\\w]+$).*)"],
}
