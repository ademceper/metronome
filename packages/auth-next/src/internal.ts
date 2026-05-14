// Singleton NextAuth instance, lazily built from env on first access. The
// /middleware, /route, and server entry points all share this same instance
// so apps only need to set env vars — no auth.ts boilerplate.
//
// Env contract:
//   OIDC_ISSUER_URI       required
//   OIDC_CLIENT_ID        required
//   OIDC_CLIENT_SECRET    optional (PKCE if omitted)
//   AUTH_SECRET           required by NextAuth itself

import type { NextAuthResult } from "next-auth"
import { type CreateAuthOptions, createAuth as createAuthBase } from "./server"

let cached: NextAuthResult | undefined

function resolveOptions(): CreateAuthOptions {
  const issuerUri = process.env.OIDC_ISSUER_URI
  const clientId = process.env.OIDC_CLIENT_ID
  if (!issuerUri || !clientId) {
    throw new Error(
      "@metronome/auth-next: OIDC_ISSUER_URI and OIDC_CLIENT_ID env vars are required"
    )
  }
  return {
    issuerUri,
    clientId,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
  }
}

export function getNextAuth(): NextAuthResult {
  if (!cached) cached = createAuthBase(resolveOptions())
  return cached
}
