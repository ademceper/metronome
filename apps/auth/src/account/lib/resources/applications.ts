import type { HttpClient, HttpRequestOptions } from "../api-client"

/* ─── DTOs ────────────────────────────────────────────────────────── */

export interface ConsentScope {
  id: string
  name: string
  displayText: string
}

export interface Consent {
  grantedScopes: ConsentScope[]
  createdDate: number
  lastUpdatedDate: number
}

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

/* ─── Endpoints ───────────────────────────────────────────────────── */

export const applicationsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<Application[]>("/applications", opts),

  deleteConsent: (id: string) =>
    http.delete(`/applications/${id}/consent`),
})
