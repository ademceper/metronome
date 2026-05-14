"use client"

import { signIn } from "@metronome/auth-next/client"
import { useEffect } from "react"

// Client-side signIn() POSTs to /api/auth/signin/oidc with the CSRF
// token + state cookie set in a single round-trip — the only flow that
// keeps NextAuth's state cookie consistent across the redirect to
// Keycloak. Server-side signIn from a route handler dropped the cookie
// between request and the NEXT_REDIRECT response, causing
// 'OperationProcessingError: unexpected state' on the callback.
export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  useEffect(() => {
    void searchParams.then((sp) =>
      signIn("oidc", { callbackUrl: sp.callbackUrl ?? "/" })
    )
  }, [searchParams])

  return null
}
