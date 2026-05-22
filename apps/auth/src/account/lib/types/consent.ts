import type { ConsentScope } from "./consent-scope"

export interface Consent {
  grantedScopes: ConsentScope[]
  createdDate: number
  lastUpdatedDate: number
}
