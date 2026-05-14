import { signIn } from "@metronome/auth-next/action"

// Server Component. NextAuth's signIn() throws a NEXT_REDIRECT response
// containing the OAuth authorize URL, so the browser receives a 302
// straight to Keycloak — no HTML, no client JS, no interstitial flash.
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const sp = await searchParams
  await signIn("oidc", { redirectTo: sp.callbackUrl ?? "/" })
}
