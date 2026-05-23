/**
 * Account API client — the single SDK entry point.
 *
 * Layered from the bottom up:
 *   1. HttpClient        — bearer auth + realm-scoped base URL + JSON
 *   2. Resource endpoints (./endpoints/*) — feed off HttpClient
 *   3. AccountClient     — assembles endpoints onto one shared HttpClient
 *
 * The React layer (api/hooks.ts, queries.ts, keys.ts) uses
 * `createClient` to build an AccountClient on top of useEnvironment.
 */

import type { Keycloak } from "oidc-spa/keycloak-js"
import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../shared/keycloak-ui-shared"
import {
  getNetworkErrorDescription,
  getNetworkErrorMessage,
} from "../../shared/keycloak-ui-shared"
import {
  applicationsEndpoints,
  credentialsEndpoints,
  devicesEndpoints,
  groupsEndpoints,
  linkedAccountsEndpoints,
  oid4vciEndpoints,
  organizationsEndpoints,
  personalInfoEndpoints,
  resourcesEndpoints,
} from "./endpoints"
import { joinPath } from "./join-path"

const CONTENT_TYPE_HEADER = "content-type"
const CONTENT_TYPE_JSON = "application/json"

/* ─── Error type ──────────────────────────────────────────────────── */

export class ApiError extends Error {
  description?: string
  constructor(message: string, description?: string) {
    super(message)
    this.description = description
  }
}

/* ─── Response helpers ────────────────────────────────────────────── */

export async function parseResponse<T>(response: Response): Promise<T> {
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

export type Links = Partial<
  Record<"first" | "prev" | "next" | "last", Record<string, string>>
>

export function parseLinks(response: Response): Links {
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

/* ─── HTTP client ─────────────────────────────────────────────────── */

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

export function createHttpClient(
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

/* ─── Account client (SDK assembly) ────────────────────────────────── */

/**
 * The public account SDK. Built by `createClient` from a single
 * HttpClient that every namespace shares. Routes consume via
 * `useAccountClient` — they never reach into endpoint factories
 * or the HttpClient directly.
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
