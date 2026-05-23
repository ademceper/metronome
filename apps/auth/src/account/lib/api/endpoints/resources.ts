import type { HttpClient, HttpRequestOptions, Links } from "../../api-client"
import { parseLinks } from "../../api-client"
import type { Permission, Resource, Scope } from "../../types"

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
