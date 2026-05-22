import type { HttpClient, HttpRequestOptions } from "../client"
import type { Group } from "../types"

export const groupsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) => http.get<Group[]>("/groups", opts),
})
