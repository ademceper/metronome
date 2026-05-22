import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../../../shared/keycloak-ui-shared"
import { parseResponse } from "../parse-response"
import { request } from "../client"
import type { CredentialContainer } from "../types"

type CallOptions = {
  context: KeycloakContext<BaseEnvironment>
  signal?: AbortSignal
}

export async function getCredentials({ signal, context }: CallOptions) {
  const response = await request("/credentials", context, { signal })
  return parseResponse<CredentialContainer[]>(response)
}
