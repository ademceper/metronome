import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../../../shared/keycloak-ui-shared"
import { parseResponse } from "../parse-response"
import { request } from "../client"
import type { ClientRepresentation } from "../types"

type CallOptions = {
  context: KeycloakContext<BaseEnvironment>
  signal?: AbortSignal
}

export async function getApplications({
  signal,
  context,
}: CallOptions): Promise<ClientRepresentation[]> {
  const response = await request("/applications", context, { signal })
  return parseResponse<ClientRepresentation[]>(response)
}

export async function deleteConsent(
  context: KeycloakContext<BaseEnvironment>,
  id: string
) {
  return request(`/applications/${id}/consent`, context, { method: "DELETE" })
}
