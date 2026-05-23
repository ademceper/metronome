import type { HttpClient, HttpRequestOptions } from "../api-client"
import type { Application } from "../types"

export const applicationsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<Application[]>("/applications", opts),

  deleteConsent: (id: string) =>
    http.delete(`/applications/${id}/consent`),
})
