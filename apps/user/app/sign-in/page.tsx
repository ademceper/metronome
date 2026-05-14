"use client"

import { signIn } from "@metronome/auth-next/client"
import { useEffect } from "react"

// Custom sign-in page wired via NextAuth's `pages.signIn`. As soon as the
// browser mounts this we call signIn("oidc"), which POSTs to NextAuth's
// per-provider signin URL and triggers an immediate redirect to Keycloak.
// The user never sees a provider picker.
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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        color: "var(--muted-foreground)",
      }}
    >
      Redirecting to Keycloak…
    </div>
  )
}
