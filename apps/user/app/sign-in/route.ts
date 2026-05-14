import { signIn } from "@metronome/auth-next/action"
import type { NextRequest } from "next/server"

// Route Handler (not a page) because NextAuth's signIn() sets cookies
// during the OAuth flow, which Next.js only allows from Route Handlers
// or Server Actions — not from regular Server Components.
//
// signIn() throws NEXT_REDIRECT with the Keycloak authorize URL, so the
// browser receives a 302 directly. No HTML page, no interstitial flash.
export async function GET(req: NextRequest) {
  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") ?? "/"
  await signIn("oidc", { redirectTo: callbackUrl })
}
