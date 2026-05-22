import type { Consent } from "./consent"

export interface Application {
  clientId: string
  clientName: string
  description: string
  userConsentRequired: boolean
  inUse: boolean
  offlineAccess: boolean
  rootUrl: string
  baseUrl: string
  effectiveUrl: string
  consent?: Consent
  logoUri: string
  policyUri: string
  tosUri: string
}
