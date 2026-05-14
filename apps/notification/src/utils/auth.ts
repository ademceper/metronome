// Self-hosted JWT acquisition. On first call, log in against the local
// notification-api with bootstrap credentials and cache the resulting JWT in
// localStorage. Subsequent calls reuse the cached token until it expires.
//
// The bootstrap user is created on first server boot via /v1/auth/register
// (run scripts/bootstrap-local-user.mjs). Re-running register against an
// existing user returns 400 and is harmless.

import { apiHostnameManager } from "@/utils/api-hostname-manager"

const TOKEN_KEY = "notification.local.jwt"
const BOOTSTRAP_EMAIL = "local@notification.dev"
const BOOTSTRAP_PASSWORD = "LocalPass123!"
const BOOTSTRAP_ORG_NAME = "Metronome Local"

let inFlight: Promise<string> | null = null

function decodeExp(jwt: string): number | null {
  try {
    const [, payload] = jwt.split(".")
    if (!payload) return null
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
    return typeof json.exp === "number" ? json.exp : null
  } catch {
    return null
  }
}

function isExpired(jwt: string | null): boolean {
  if (!jwt) return true
  const exp = decodeExp(jwt)
  if (!exp) return true
  return Date.now() / 1000 >= exp - 60
}

async function login(): Promise<string | null> {
  const base = apiHostnameManager.getHostname()
  const res = await fetch(`${base}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: BOOTSTRAP_EMAIL,
      password: BOOTSTRAP_PASSWORD,
    }),
  })
  if (!res.ok) return null
  const json = await res.json()
  return json?.data?.token ?? null
}

async function register(): Promise<string | null> {
  const base = apiHostnameManager.getHostname()
  const res = await fetch(`${base}/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: BOOTSTRAP_EMAIL,
      password: BOOTSTRAP_PASSWORD,
      firstName: "Local",
      lastName: "User",
      organizationName: BOOTSTRAP_ORG_NAME,
    }),
  })
  if (!res.ok) return null
  const json = await res.json()
  return json?.data?.token ?? null
}

async function acquireToken(): Promise<string> {
  let token = await login()
  if (!token) {
    await register()
    token = await login()
  }
  if (!token) throw new Error("Failed to bootstrap local auth")
  localStorage.setItem(TOKEN_KEY, token)
  return token
}

export async function getToken(): Promise<string> {
  const cached = localStorage.getItem(TOKEN_KEY)
  if (cached && !isExpired(cached)) return cached
  if (inFlight) return inFlight
  inFlight = acquireToken().finally(() => {
    inFlight = null
  })
  return inFlight
}
