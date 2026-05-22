import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../../../shared/keycloak-ui-shared"
import { parseResponse } from "../parse-response"
import { request } from "../client"
import type { UserRepresentation } from "../types"

type CallOptions = {
  context: KeycloakContext<BaseEnvironment>
  signal?: AbortSignal
}

export async function getPersonalInfo({
  signal,
  context,
}: CallOptions): Promise<UserRepresentation> {
  const response = await request("/?userProfileMetadata=true", context, {
    signal,
  })
  return parseResponse<UserRepresentation>(response)
}

export async function getSupportedLocales({
  signal,
  context,
}: CallOptions): Promise<string[]> {
  const response = await request("/supportedLocales", context, { signal })
  return parseResponse<string[]>(response)
}

export async function savePersonalInfo(
  context: KeycloakContext<BaseEnvironment>,
  info: UserRepresentation
): Promise<void> {
  const response = await request("/", context, { body: info, method: "POST" })
  if (!response.ok) {
    const { errors } = await response.json()
    throw errors
  }
  return undefined
}
