/**
 * Public surface of the account API client.
 *
 * Architecture:
 *
 *   ┌────────────────────────────────────────────────────────┐
 *   │ Routes / components                                    │
 *   │   └─ usePersonalInfo, useApplications, useResources …  │  ← hooks.ts
 *   └────────────────────────────────────────────────────────┘
 *               │
 *               ▼
 *   ┌────────────────────────────────────────────────────────┐
 *   │ useAccountClient()  →  AccountClient                   │
 *   │   client.personalInfo.get()                            │  ← client.ts
 *   │   client.applications.list()                           │     (SDK assembly)
 *   │   client.devices.delete(id) …                          │
 *   └────────────────────────────────────────────────────────┘
 *               │
 *               ▼
 *   ┌────────────────────────────────────────────────────────┐
 *   │ HttpClient (get/post/put/delete/raw)                   │  ← client.ts
 *   │   auth, base URL, JSON parse, error surface            │     (transport)
 *   └────────────────────────────────────────────────────────┘
 *
 * Endpoint factories live in endpoints/*.ts. They never touch fetch
 * directly — they call the HttpClient passed in by `createClient`.
 */

// React surface — preferred entry point
export * from "./hooks"

// SDK primitives (for prefetching, optimistic updates, custom orchestration)
export { createClient } from "./client"
export type { AccountClient, HttpClient, HttpRequestOptions } from "./client"
export { accountKeys } from "./keys"
export { accountQueries } from "./queries"

// Domain types
export type { LinkedAccountQueryParams } from "./endpoints/linked-accounts"
export { ApiError } from "./parse-response"
export type * from "./types"
