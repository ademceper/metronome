import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../../../shared/keycloak-ui-shared"
import { parseResponse } from "../parse-response"
import { request } from "../client"
import type { Group } from "../types"

type CallOptions = {
  context: KeycloakContext<BaseEnvironment>
  signal?: AbortSignal
}

export async function getGroups({ signal, context }: CallOptions) {
  const response = await request("/groups", context, { signal })
  return parseResponse<Group[]>(response)
}
