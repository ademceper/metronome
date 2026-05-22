import type { ConsentScopeRepresentation } from "./consent-scope-representation"

export interface ConsentRepresentation {
  grantedScopes: ConsentScopeRepresentation[]
  createdDate: number
  lastUpdatedDate: number
}
