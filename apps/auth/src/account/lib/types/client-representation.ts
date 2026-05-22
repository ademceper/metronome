import type { ConsentRepresentation } from "./consent-representation"

export interface ClientRepresentation {
  clientId: string
  clientName: string
  description: string
  userConsentRequired: boolean
  inUse: boolean
  offlineAccess: boolean
  rootUrl: string
  baseUrl: string
  effectiveUrl: string
  consent?: ConsentRepresentation
  logoUri: string
  policyUri: string
  tosUri: string
}
