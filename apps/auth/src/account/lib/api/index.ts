/**
 * Public surface for the account data layer.
 *
 *   routes  →  useXxx hooks (hooks.ts)
 *                  ↓
 *              accountQueries / accountKeys (queries.ts)
 *                  ↓
 *              AccountClient (../api-client.ts)
 *                  ↓
 *              HttpClient + resource factories (../resources/*)
 *
 * Resource files (../resources/*) co-locate their DTOs with their
 * endpoint factories — the Stripe / OpenAI SDK pattern. There is no
 * separate `types/` folder; consumers re-export DTOs through this
 * barrel.
 */

export { type AccountClient, ApiError, createClient } from "../api-client"
export { accountKeys, accountQueries } from "./queries"
export * from "./hooks"

/* DTOs and per-resource params */
export type {
  Application,
  Consent,
  ConsentScope,
} from "../resources/applications"
export type {
  Credential,
  CredentialContainer,
  CredentialMetadata,
  CredentialMetadataMessage,
  CredentialTypeMetadata,
} from "../resources/credentials"
export type { Device, Session } from "../resources/devices"
export type { Group } from "../resources/groups"
export type {
  AccountLinkUri,
  LinkedAccount,
  LinkedAccountQueryParams,
} from "../resources/linked-accounts"
export type {
  CredentialsIssuer,
  SupportedCredentialConfiguration,
} from "../resources/oid4vci"
export type { Organization } from "../resources/organizations"
export type {
  User,
  UserProfileAttributeMetadata,
  UserProfileMetadata,
} from "../resources/personal-info"
export type {
  Client,
  Permission,
  Permissions,
  Resource,
  Scope,
} from "../resources/shared-resources"
