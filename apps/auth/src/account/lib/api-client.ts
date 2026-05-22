/**
 * Account API client.
 *
 * Single-file SDK for the Keycloak account REST surface. Layered as:
 *
 *   parseResponse / parseLinks  →   helpers (response → typed data / Link header)
 *   HttpClient                  →   low-level transport (auth, base URL, JSON)
 *   AccountClient               →   resource namespaces built on top of HttpClient
 *   accountQueries / accountKeys →  TanStack Query glue
 *   useAccountClient / useXxx   →   React surface routes consume
 */

import {
  type UseMutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation"
import type { Keycloak } from "oidc-spa/keycloak-js"
import { useMemo } from "react"
import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../shared/keycloak-ui-shared"
import { useEnvironment } from "../../shared/keycloak-ui-shared"
import {
  getNetworkErrorDescription,
  getNetworkErrorMessage,
} from "../../shared/keycloak-ui-shared"
import type { AccountEnvironment } from ".."
import { joinPath } from "./join-path"

export type {
  AccountLinkUri,
  Client,
  Application,
  Consent,
  ConsentScope,
  CredentialContainer,
  CredentialMetadata,
  CredentialMetadataMessage,
  Credential,
  CredentialTypeMetadata,
  CredentialsIssuer,
  Device,
  Group,
  LinkedAccount,
  Permission,
  Permissions,
  Resource,
  Scope,
  Session,
  SupportedCredentialConfiguration,
  UserProfileAttributeMetadata,
  UserProfileMetadata,
  User,
} from "./types"

import type {
  Application,
  CredentialContainer,
  CredentialsIssuer,
  Device,
  Group,
  LinkedAccount,
  Permission,
  Resource,
  Scope,
  SupportedCredentialConfiguration,
  User,
} from "./types"

/* ─── Response helpers ─────────────────────────────────────────────── */

const CONTENT_TYPE_HEADER = "content-type"
const CONTENT_TYPE_JSON = "application/json"

export class ApiError extends Error {
  description?: string
  constructor(message: string, description?: string) {
    super(message)
    this.description = description
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get(CONTENT_TYPE_HEADER)
  const isJSON = contentType ? contentType.includes(CONTENT_TYPE_JSON) : false
  if (!isJSON) {
    throw new Error(
      `Expected response to have a JSON content type, got '${contentType}' instead.`,
    )
  }
  const data = await parseJSON(response)
  if (!response.ok) {
    const message = getNetworkErrorMessage(data)
    const description = getNetworkErrorDescription(data)
    if (!message) {
      throw new Error(
        "Unable to retrieve error message from response, no matching key found.",
      )
    }
    throw new ApiError(message, description)
  }
  return data as T
}

async function parseJSON(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch (error) {
    throw new Error("Unable to parse response as valid JSON.", {
      cause: error,
    })
  }
}

export type Links = Partial<Record<"first" | "prev" | "next" | "last", Record<string, string>>>

function parseLinks(response: Response): Links {
  const header = response.headers.get("Link")
  if (!header) return {}
  const links: Links = {}
  for (const part of header.split(",")) {
    const [rawUrl, rawRel] = part.split(";")
    if (!rawUrl || !rawRel) continue
    const url = rawUrl.trim().slice(1, -1)
    const rel = rawRel.trim().split("=")[1]?.slice(1, -1) as keyof Links
    if (!rel) continue
    const params: Record<string, string> = {}
    for (const [k, v] of new URL(url).searchParams) params[k] = v
    links[rel] = params
  }
  return links
}

/* ─── HTTP transport ───────────────────────────────────────────────── */

export type HttpRequestOptions = {
  signal?: AbortSignal
  searchParams?: Record<string, string>
  fullUrl?: URL
}

export type HttpClient = {
  get<T>(path: string, opts?: HttpRequestOptions): Promise<T>
  post<T>(path: string, body?: unknown, opts?: HttpRequestOptions): Promise<T>
  put<T>(path: string, body?: unknown, opts?: HttpRequestOptions): Promise<T>
  delete<T = void>(path: string, opts?: HttpRequestOptions): Promise<T>
  raw(
    path: string,
    init?: HttpRequestOptions & { method?: string; body?: unknown },
  ): Promise<Response>
}

const tokenProvider = (keycloak: Keycloak) => async () => {
  try {
    await keycloak.updateToken(5)
  } catch {
    await keycloak.login()
  }
  return keycloak.token
}

const accountUrl = (environment: BaseEnvironment, path: string) =>
  new URL(
    joinPath(
      environment.serverBaseUrl,
      "realms",
      environment.realm,
      "account",
      path,
    ),
  )

function createHttpClient(
  context: KeycloakContext<BaseEnvironment>,
): HttpClient {
  const getToken = tokenProvider(context.keycloak)

  const send = async (
    path: string,
    init: HttpRequestOptions & { method?: string; body?: unknown } = {},
  ): Promise<Response> => {
    const url = init.fullUrl ?? accountUrl(context.environment, path)
    if (init.searchParams) {
      for (const [key, value] of Object.entries(init.searchParams)) {
        url.searchParams.set(key, value)
      }
    }
    return fetch(url, {
      method: init.method,
      signal: init.signal,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      headers: {
        [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON,
        authorization: `Bearer ${await getToken()}`,
      },
    })
  }

  const json = async <T>(response: Response): Promise<T> => {
    if (response.status === 204) return undefined as T
    return parseResponse<T>(response)
  }

  return {
    async get<T>(path: string, opts?: HttpRequestOptions): Promise<T> {
      return json<T>(await send(path, opts))
    },
    async post<T>(
      path: string,
      body?: unknown,
      opts?: HttpRequestOptions,
    ): Promise<T> {
      return json<T>(await send(path, { ...opts, method: "POST", body }))
    },
    async put<T>(
      path: string,
      body?: unknown,
      opts?: HttpRequestOptions,
    ): Promise<T> {
      return json<T>(await send(path, { ...opts, method: "PUT", body }))
    },
    async delete<T = void>(
      path: string,
      opts?: HttpRequestOptions,
    ): Promise<T> {
      const r = await send(path, { ...opts, method: "DELETE" })
      if (!r.ok) return parseResponse<T>(r)
      if (r.status === 204) return undefined as T
      return r.json().catch(() => undefined as T)
    },
    raw: (path, init) => send(path, init ?? {}),
  }
}

/* ─── Resource namespaces ──────────────────────────────────────────── */

export type LinkedAccountQueryParams = {
  first: number
  max: number
  search?: string
  linked?: boolean
}

const personalInfoEndpoints = (http: HttpClient) => ({
  get: (opts?: HttpRequestOptions) =>
    http.get<User>("/?userProfileMetadata=true", opts),
  supportedLocales: (opts?: HttpRequestOptions) =>
    http.get<string[]>("/supportedLocales", opts),
  update: async (info: User) => {
    const response = await http.raw("/", { method: "POST", body: info })
    if (!response.ok) {
      const { errors } = await response.json()
      throw errors
    }
  },
})

const applicationsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<Application[]>("/applications", opts),
  deleteConsent: (id: string) =>
    http.delete(`/applications/${id}/consent`),
})

const credentialsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<CredentialContainer[]>("/credentials", opts),
})

const devicesEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<Device[]>("/sessions/devices", opts),
  delete: (id?: string) => http.delete(`/sessions${id ? `/${id}` : ""}`),
})

const groupsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) => http.get<Group[]>("/groups", opts),
})

const linkedAccountsEndpoints = (http: HttpClient) => ({
  list: (query: LinkedAccountQueryParams, opts?: HttpRequestOptions) => {
    const searchParams = Object.entries(query).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value.toString() }),
      {} as Record<string, string>,
    )
    return http.get<LinkedAccount[]>("/linked-accounts", {
      ...opts,
      searchParams,
    })
  },
  unlink: (account: LinkedAccount) =>
    http.delete(`/linked-accounts/${account.providerName}`),
})

const organizationsEndpoints = (http: HttpClient) => ({
  list: (opts?: HttpRequestOptions) =>
    http.get<OrganizationRepresentation[]>("/organizations", opts),
})

const resourcesEndpoints = (http: HttpClient) => ({
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
  ) => http.put(`/resources/${resourceId}/permissions`, [{ username, scopes }]),
  updatePermissions: (resourceId: string, permissions: Permission[]) =>
    http.put(`/resources/${resourceId}/permissions`, permissions),
})

const oid4vciEndpoints = (
  http: HttpClient,
  serverBaseUrl: string,
  realm: string,
) => ({
  issuer: async () => {
    const path = joinPath(
      "/realms/",
      realm,
      "/.well-known/openid-credential-issuer",
    )
    const response = await http.raw(path, {
      fullUrl: new URL(joinPath(serverBaseUrl, path)),
    })
    return parseResponse<CredentialsIssuer>(response)
  },
  createOffer: async (
    config: SupportedCredentialConfiguration,
    issuer: CredentialsIssuer,
  ) => {
    const response = await http.raw(
      "/protocol/oid4vc/create-credential-offer",
      {
        fullUrl: new URL(
          joinPath(
            issuer.credential_issuer +
              "/protocol/oid4vc/create-credential-offer",
          ),
        ),
        searchParams: {
          credential_configuration_id: config.id,
          type: "qr-code",
          width: "500",
          height: "500",
        },
      },
    )
    return response.blob()
  },
})

/* ─── AccountClient assembly ───────────────────────────────────────── */

export type AccountClient = {
  http: HttpClient
  personalInfo: ReturnType<typeof personalInfoEndpoints>
  applications: ReturnType<typeof applicationsEndpoints>
  credentials: ReturnType<typeof credentialsEndpoints>
  devices: ReturnType<typeof devicesEndpoints>
  groups: ReturnType<typeof groupsEndpoints>
  linkedAccounts: ReturnType<typeof linkedAccountsEndpoints>
  organizations: ReturnType<typeof organizationsEndpoints>
  resources: ReturnType<typeof resourcesEndpoints>
  oid4vci: ReturnType<typeof oid4vciEndpoints>
}

export function createClient(
  context: KeycloakContext<BaseEnvironment>,
): AccountClient {
  const { serverBaseUrl, realm } = context.environment
  const http = createHttpClient(context)
  return {
    http,
    personalInfo: personalInfoEndpoints(http),
    applications: applicationsEndpoints(http),
    credentials: credentialsEndpoints(http),
    devices: devicesEndpoints(http),
    groups: groupsEndpoints(http),
    linkedAccounts: linkedAccountsEndpoints(http),
    organizations: organizationsEndpoints(http),
    resources: resourcesEndpoints(http),
    oid4vci: oid4vciEndpoints(http, serverBaseUrl, realm),
  }
}

/* ─── Query keys ───────────────────────────────────────────────────── */

export const accountKeys = {
  all: ["account"] as const,
  personalInfo: () => [...accountKeys.all, "personal-info"] as const,
  supportedLocales: () => [...accountKeys.all, "supported-locales"] as const,
  applications: () => [...accountKeys.all, "applications"] as const,
  credentials: () => [...accountKeys.all, "credentials"] as const,
  devices: () => [...accountKeys.all, "devices"] as const,
  groups: () => [...accountKeys.all, "groups"] as const,
  organizations: () => [...accountKeys.all, "organizations"] as const,
  linkedAccounts: (params?: LinkedAccountQueryParams) =>
    params
      ? ([...accountKeys.all, "linked-accounts", params] as const)
      : ([...accountKeys.all, "linked-accounts"] as const),
  resources: (params?: { isShared: boolean; query: Record<string, string> }) =>
    params
      ? ([...accountKeys.all, "resources", params] as const)
      : ([...accountKeys.all, "resources"] as const),
  resourcePermissions: (resourceId: string) =>
    [...accountKeys.all, "resources", resourceId, "permissions"] as const,
  oid4vciIssuer: () => [...accountKeys.all, "oid4vci", "issuer"] as const,
}

/* ─── queryOptions factories ───────────────────────────────────────── */

export const accountQueries = {
  personalInfo: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.personalInfo(),
      queryFn: ({ signal }) => client.personalInfo.get({ signal }),
    }),
  supportedLocales: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.supportedLocales(),
      queryFn: ({ signal }) => client.personalInfo.supportedLocales({ signal }),
    }),
  applications: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.applications(),
      queryFn: ({ signal }) => client.applications.list({ signal }),
    }),
  credentials: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.credentials(),
      queryFn: ({ signal }) => client.credentials.list({ signal }),
    }),
  devices: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.devices(),
      queryFn: ({ signal }) => client.devices.list({ signal }),
    }),
  groups: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.groups(),
      queryFn: ({ signal }) => client.groups.list({ signal }),
    }),
  organizations: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.organizations(),
      queryFn: ({ signal }) => client.organizations.list({ signal }),
    }),
  linkedAccounts: (client: AccountClient, params: LinkedAccountQueryParams) =>
    queryOptions({
      queryKey: accountKeys.linkedAccounts(params),
      queryFn: ({ signal }) => client.linkedAccounts.list(params, { signal }),
    }),
  resources: (
    client: AccountClient,
    params: { query: Record<string, string>; isShared: boolean },
    options?: { withPermissionRequests?: boolean },
  ) =>
    queryOptions({
      queryKey: accountKeys.resources(params),
      queryFn: async ({ signal }) => {
        const result = await client.resources.list(
          params.query,
          params.isShared,
          { signal },
        )
        if (options?.withPermissionRequests && !params.isShared) {
          await Promise.all(
            result.data.map(async (r) => {
              r.shareRequests = await client.resources.permissionRequests(
                r._id,
                { signal },
              )
            }),
          )
        }
        return result
      },
    }),
  resourcePermissions: (client: AccountClient, resourceId: string) =>
    queryOptions({
      queryKey: accountKeys.resourcePermissions(resourceId),
      queryFn: ({ signal }) =>
        client.resources.permissions(resourceId, { signal }),
    }),
  oid4vciIssuer: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.oid4vciIssuer(),
      queryFn: () => client.oid4vci.issuer(),
    }),
}

/* ─── React surface ────────────────────────────────────────────────── */

export const useAccountClient = (): AccountClient => {
  const context = useEnvironment<AccountEnvironment>()
  return useMemo(() => createClient(context), [context])
}

export const usePersonalInfo = () =>
  useQuery(accountQueries.personalInfo(useAccountClient()))
export const useSupportedLocales = () =>
  useQuery(accountQueries.supportedLocales(useAccountClient()))
export const useApplications = () =>
  useQuery(accountQueries.applications(useAccountClient()))
export const useCredentials = () =>
  useQuery(accountQueries.credentials(useAccountClient()))
export const useDevices = () =>
  useQuery(accountQueries.devices(useAccountClient()))
export const useGroups = () =>
  useQuery(accountQueries.groups(useAccountClient()))
export const useUserOrganizations = () =>
  useQuery(accountQueries.organizations(useAccountClient()))
export const useLinkedAccounts = (params: LinkedAccountQueryParams) =>
  useQuery(accountQueries.linkedAccounts(useAccountClient(), params))
export const useResources = (
  params: { query: Record<string, string>; isShared: boolean },
  options?: { withPermissionRequests?: boolean },
) => useQuery(accountQueries.resources(useAccountClient(), params, options))
export const useOid4VciIssuer = () =>
  useQuery(accountQueries.oid4vciIssuer(useAccountClient()))

type MutationOpts<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
>

export const useSavePersonalInfo = (
  options?: MutationOpts<void, User>,
) => {
  const client = useAccountClient()
  return useMutation({
    mutationFn: (info) => client.personalInfo.update(info),
    ...options,
  })
}

export const useDeleteConsent = (options?: MutationOpts<unknown, string>) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => client.applications.deleteConsent(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.applications() }),
    ...options,
  })
}

export const useDeleteSession = (
  options?: MutationOpts<unknown, string | undefined>,
) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => client.devices.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.devices() }),
    ...options,
  })
}

export const useUnLinkAccount = (
  options?: MutationOpts<unknown, LinkedAccount>,
) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (account) => client.linkedAccounts.unlink(account),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.linkedAccounts() }),
    ...options,
  })
}

export const useUpdatePermissions = (
  options?: MutationOpts<
    unknown,
    { resourceId: string; permissions: Permission[] }
  >,
) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ resourceId, permissions }) =>
      client.resources.updatePermissions(resourceId, permissions),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.resources() }),
    ...options,
  })
}

export const useUpdateRequest = (
  options?: MutationOpts<
    unknown,
    { resourceId: string; username: string; scopes: string[] }
  >,
) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ resourceId, username, scopes }) =>
      client.resources.share(resourceId, username, scopes),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.resources() }),
    ...options,
  })
}

export const useUnshareResource = (
  options?: MutationOpts<unknown, Resource>,
) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (resource) => {
      const perms = await client.resources.permissions(resource._id)
      const cleared = perms.map(
        ({ username }) => ({ username, scopes: [] }) as Permission,
      )
      await client.resources.updatePermissions(resource._id, cleared)
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.resources() }),
    ...options,
  })
}
