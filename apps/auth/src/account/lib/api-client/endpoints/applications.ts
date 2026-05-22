import type { HttpClient, HttpRequestOptions } from "../client"
import type { ClientRepresentation } from "../types"

export const applicationsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<ClientRepresentation[]>("/applications", opts),

  deleteConsent: (id: string) =>
    http.delete(`/applications/${id}/consent`),
})
