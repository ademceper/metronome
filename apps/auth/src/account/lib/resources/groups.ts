import type { HttpClient, HttpRequestOptions } from "../api-client"

/* ─── DTOs ────────────────────────────────────────────────────────── */

export interface Group {
  id?: string
  name: string
  path: string
}

/* ─── Endpoints ───────────────────────────────────────────────────── */

export const groupsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) => http.get<Group[]>("/groups", opts),
})
