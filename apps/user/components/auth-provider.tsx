"use client"

import { oidcEarlyInit } from "oidc-spa/entrypoint"
import type { ReactNode } from "react"
import { bootstrapOidc, OidcInitializationGate } from "@/lib/auth"

// Required by oidc-spa before any other oidc-spa code runs. The Vite plugin
// injects this automatically for SPA apps; in Next.js we call it manually
// from the auth provider's client entry.
oidcEarlyInit({ BASE_URL: "/" })

bootstrapOidc({
  implementation: "real",
  issuerUri:
    process.env.NEXT_PUBLIC_OIDC_ISSUER_URI ??
    "http://localhost:8080/realms/tiko",
  clientId: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID ?? "user-spa",
})

export function AuthProvider({ children }: { children: ReactNode }) {
  return <OidcInitializationGate>{children}</OidcInitializationGate>
}
