import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../../shared/keycloak-ui-shared"
import { type HttpClient, createHttpClient } from "../api-client"
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
