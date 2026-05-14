// Next.js 16 renamed `middleware.ts` to `proxy.ts`. We import the actual
// function (instead of re-exporting `default`) because Turbopack's static
// analysis can't see through pure re-exports.
import middleware from "@metronome/auth-next/middleware"

export default middleware

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
