// Server-only re-export of NextAuth's signIn / signOut / auth bound to
// the singleton config. Apps use these from Server Components, Server
// Actions, Route Handlers, or middleware. Calling signIn() from a Server
// Component triggers a server-side NEXT_REDIRECT — the browser receives
// a 302 directly to the OAuth provider without rendering any interstitial.

import type { NextAuthResult } from "next-auth"
import { getNextAuth } from "./internal"

const next = getNextAuth()
export const signIn: NextAuthResult["signIn"] = next.signIn
export const signOut: NextAuthResult["signOut"] = next.signOut
export const auth: NextAuthResult["auth"] = next.auth
