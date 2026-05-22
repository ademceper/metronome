import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../../../shared/keycloak-ui-shared"
import { request } from "../client"
import { type Links, parseLinks } from "../parse-links"
import { parseResponse } from "../parse-response"
import type {
  Permission,
  Resource,
  Scope,
} from "../types"

type CallOptions = {
  context: KeycloakContext<BaseEnvironment>
  signal?: AbortSignal
}

export const fetchResources = async (
  { signal, context }: CallOptions,
  requestParams: Record<string, string>,
  shared = false
): Promise<{ data: Resource[]; links: Links }> => {
  const response = await request(
    `/resources${shared ? "/shared-with-me?" : "?"}`,
    context,
    { searchParams: shared ? requestParams : undefined, signal }
  )

  const links = parseLinks(response)
  const data = await response.json()
  if (!data) throw new Error("Could not fetch")

  return { data, links }
}

export const fetchPermission = async (
  { signal, context }: CallOptions,
  resourceId: string
): Promise<Permission[]> => {
  const response = await request(
    `/resources/${resourceId}/permissions`,
    context,
    { signal }
  )
  return parseResponse<Permission[]>(response)
}

export async function getPermissionRequests(
  resourceId: string,
  { signal, context }: CallOptions
): Promise<Permission[]> {
  const response = await request(
    `/resources/${resourceId}/permissions/requests`,
    context,
    { signal }
  )
  return parseResponse<Permission[]>(response)
}

export const updateRequest = (
  context: KeycloakContext<BaseEnvironment>,
  resourceId: string,
  username: string,
  scopes: Scope[] | string[]
) =>
  request(`/resources/${resourceId}/permissions`, context, {
    method: "PUT",
    body: [{ username, scopes }],
  })

export const updatePermissions = (
  context: KeycloakContext<BaseEnvironment>,
  resourceId: string,
  permissions: Permission[]
) =>
  request(`/resources/${resourceId}/permissions`, context, {
    method: "PUT",
    body: permissions,
  })
