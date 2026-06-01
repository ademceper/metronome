import type { HttpClient, HttpRequestOptions, Links } from "../api-client"
import { parseLinks } from "../api-client"

/* ─── DTOs ────────────────────────────────────────────────────────── */

export interface Scope {
  name: string
  displayName?: string
}

/**
 * Owning client of a `Resource` — distinct from the larger
 * `Application` returned by /applications.
 */
export interface Client {
  baseUrl: string
  clientId: string
  name?: string
}

export interface Permission {
  email?: string
  firstName?: string
  lastName?: string
  scopes: Scope[] | string[]
  username: string
}

export interface Permissions {
  permissions: Permission[]
  row?: number
}

export interface Resource {
  _id: string
  name: string
  client: Client
  scopes: Scope[]
  uris: string[]
  shareRequests?: Permission[]
}

/* ─── Endpoints ───────────────────────────────────────────────────── */

export const resourcesEndpoints = (http: HttpClient) => ({
  list: async (
    query: Record<string, string>,
    isShared = false,
    opts?: HttpRequestOptions,
  ): Promise<{ data: Resource[]; links: Links }> => {
    const path = `/resources${isShared ? "/shared-with-me?" : "?"}`
    const response = await http.raw(path, {
      ...opts,
      searchParams: isShared ? query : undefined,
    })
    const links = parseLinks(response)
    const data = await response.json()
    if (!data) throw new Error("Could not fetch resources")
    return { data, links }
  },

  permissions: (resourceId: string, opts?: HttpRequestOptions) =>
    http.get<Permission[]>(`/resources/${resourceId}/permissions`, opts),

  permissionRequests: (resourceId: string, opts?: HttpRequestOptions) =>
    http.get<Permission[]>(
      `/resources/${resourceId}/permissions/requests`,
      opts,
    ),

  share: (
    resourceId: string,
    username: string,
    scopes: Scope[] | string[],
  ) =>
    http.put(`/resources/${resourceId}/permissions`, [{ username, scopes }]),

  updatePermissions: (resourceId: string, permissions: Permission[]) =>
    http.put(`/resources/${resourceId}/permissions`, permissions),
})
