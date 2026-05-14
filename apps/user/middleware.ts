// Next.js statically parses the `config` export, so it must be a literal
// in this file — can't be re-exported. The `default` middleware fn comes
// from the package.
export { default } from "@metronome/auth-next/middleware"

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
