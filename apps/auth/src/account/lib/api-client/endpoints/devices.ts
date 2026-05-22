import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../../../shared/keycloak-ui-shared"
import { parseResponse } from "../parse-response"
import { request } from "../client"
import type { DeviceRepresentation } from "../types"

type CallOptions = {
  context: KeycloakContext<BaseEnvironment>
  signal?: AbortSignal
}

export async function getDevices({
  signal,
  context,
}: CallOptions): Promise<DeviceRepresentation[]> {
  const response = await request("/sessions/devices", context, { signal })
  return parseResponse<DeviceRepresentation[]>(response)
}

export async function deleteSession(
  context: KeycloakContext<BaseEnvironment>,
  id?: string
) {
  return request(`/sessions${id ? `/${id}` : ""}`, context, {
    method: "DELETE",
  })
}
