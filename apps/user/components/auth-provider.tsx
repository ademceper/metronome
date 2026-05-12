"use client"

import type { ReactNode } from "react"
import { bootstrapOidc, OidcInitializationGate } from "@/lib/auth"

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
