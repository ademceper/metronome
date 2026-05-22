import type { HttpClient, HttpRequestOptions } from "../client"
import type { LinkedAccountRepresentation } from "../types"

export type LinkedAccountQueryParams = {
  first: number
  max: number
  search?: string
  linked?: boolean
}

export const linkedAccountsEndpoints = (http: HttpClient) => ({
  list: (query: LinkedAccountQueryParams, opts?: HttpRequestOptions) => {
    const searchParams = Object.entries(query).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value.toString() }),
      {} as Record<string, string>,
    )
    return http.get<LinkedAccountRepresentation[]>("/linked-accounts", {
      ...opts,
      searchParams,
    })
  },

  unlink: (account: LinkedAccountRepresentation) =>
    http.delete(`/linked-accounts/${account.providerName}`),
})
