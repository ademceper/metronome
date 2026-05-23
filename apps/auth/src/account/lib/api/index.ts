/**
 * Account API layer — public surface that routes consume.
 *
 *   routes
 *     └─ uses → useXxx hooks  (hooks.ts)
 *                     └─ uses → useAccountClient → AccountClient (client.ts)
 *                                                       └─ uses → HttpClient (../api-client.ts)
 *
 * Internal organisation is split (HTTP transport ↔ SDK assembly ↔
 * TanStack glue ↔ DTOs), but every consumer imports from "../lib/api"
 * — the barrel is the only public path.
 */

export { type AccountClient, createClient } from "./client"
export type { LinkedAccountQueryParams } from "./endpoints"
export { accountKeys } from "./keys"
export { accountQueries } from "./queries"
export * from "./hooks"

export { ApiError } from "../api-client"
export type * from "../types"
