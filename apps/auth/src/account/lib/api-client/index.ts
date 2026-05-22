/**
 * Public surface of the account API client.
 *
 * Routes import everything from `@/account/lib/api-client` — never from
 * individual endpoint/hook files. The barrel keeps the import paths
 * stable even when internal files move around.
 */

// Hooks — preferred entry point for components
export * from "./hooks"

// Underlying factories — useful for prefetching, optimistic updates,
// and custom orchestration outside the React tree.
export { accountKeys } from "./keys"
export { accountQueries } from "./queries"

// Endpoint-specific helpers / types that some routes still need directly
export type { LinkedAccountQueryParams } from "./endpoints/linked-accounts"
export { deleteSession } from "./endpoints/devices"
export { fetchPermission } from "./endpoints/resources"
export { requestVCOffer } from "./endpoints/oid4vci"
export { ApiError } from "./parse-response"
export type * from "./types"
