import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../../../shared/keycloak-ui-shared"
import { parseResponse } from "../parse-response"
import { request } from "../client"
import type { LinkedAccountRepresentation } from "../types"

type CallOptions = {
  context: KeycloakContext<BaseEnvironment>
  signal?: AbortSignal
}

export type LinkedAccountQueryParams = {
  first: number
  max: number
  search?: string
  linked?: boolean
}

export async function getLinkedAccounts(
  { signal, context }: CallOptions,
  query: LinkedAccountQueryParams
) {
  const response = await request("/linked-accounts", context, {
    searchParams: Object.entries(query).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value.toString() }),
      {}
    ),
    signal,
  })
  return parseResponse<LinkedAccountRepresentation[]>(response)
}

export async function unLinkAccount(
  context: KeycloakContext<BaseEnvironment>,
  account: LinkedAccountRepresentation
) {
  const response = await request(
    "/linked-accounts/" + account.providerName,
    context,
    { method: "DELETE" }
  )
  if (response.ok) return
  return parseResponse(response)
}
