// One-liner middleware re-export. App usage:
//   // apps/<app>/middleware.ts
//   export { default, config } from "@metronome/auth-next/middleware"

import type { NextAuthResult } from "next-auth"
import { getNextAuth } from "./internal"

const middleware: NextAuthResult["auth"] = getNextAuth().auth
export default middleware

// Sensible default matcher: protect every route except Next internals and
// the NextAuth handler. Apps that want a different matcher should write
// their own middleware.ts instead of re-exporting this one.
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
