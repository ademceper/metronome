import type { Keycloak } from "oidc-spa/keycloak-js"
import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../../shared/keycloak-ui-shared"
import { joinPath } from "../join-path"
import { CONTENT_TYPE_HEADER, CONTENT_TYPE_JSON } from "./constants"
import { applicationsEndpoints } from "./endpoints/applications"
import { credentialsEndpoints } from "./endpoints/credentials"
import { devicesEndpoints } from "./endpoints/devices"
import { groupsEndpoints } from "./endpoints/groups"
import { linkedAccountsEndpoints } from "./endpoints/linked-accounts"
import { oid4vciEndpoints } from "./endpoints/oid4vci"
import { organizationsEndpoints } from "./endpoints/organizations"
import { personalInfoEndpoints } from "./endpoints/personal-info"
import { resourcesEndpoints } from "./endpoints/resources"
import { parseResponse } from "./parse-response"

/**
 * Generic request options accepted by the HTTP layer below. Routes do
 * not construct these directly — they call `client.<resource>.<method>`
 * and the endpoint module forwards what it needs.
 */
export type HttpRequestOptions = {
  signal?: AbortSignal
  searchParams?: Record<string, string>
  fullUrl?: URL
}

/**
 * Low-level HTTP transport. All endpoint modules consume this — never
 * `fetch` directly. The HTTP client is responsible for:
 *  - auth header (Bearer access token, with refresh)
 *  - base URL (realm-scoped account API)
 *  - search params
 *  - parsing JSON / surfacing ApiError on non-2xx
 *  - exposing `raw` for endpoints that need Response headers (Link)
 *    or that target external URLs (oid4vci issuer discovery).
 */
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

const createHttpClient = (
  context: KeycloakContext<BaseEnvironment>,
): HttpClient => {
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

/**
 * The public account SDK. Built by `createClient` from a single
 * HttpClient that every namespace shares. Routes consume via the
 * `useClient` hook — they never reach into endpoints/* directly.
 */
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
