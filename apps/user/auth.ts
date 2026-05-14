import { createAuth } from "@metronome/auth-next/server"
import type { NextAuthResult } from "next-auth"

const issuerUri =
  process.env.OIDC_ISSUER_URI ?? "http://localhost:8080/realms/tiko"
const clientId = process.env.OIDC_CLIENT_ID ?? "user-spa"
const clientSecret = process.env.OIDC_CLIENT_SECRET

const nextAuth: NextAuthResult = createAuth({
  issuerUri,
  clientId,
  clientSecret,
})

export const auth: NextAuthResult["auth"] = nextAuth.auth
export const handlers: NextAuthResult["handlers"] = nextAuth.handlers
export const signIn: NextAuthResult["signIn"] = nextAuth.signIn
export const signOut: NextAuthResult["signOut"] = nextAuth.signOut
