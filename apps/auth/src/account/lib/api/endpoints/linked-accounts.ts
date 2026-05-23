import type { HttpClient, HttpRequestOptions } from "../../api-client"
import type { LinkedAccount } from "../../types"

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
    return http.get<LinkedAccount[]>("/linked-accounts", {
      ...opts,
      searchParams,
    })
  },

  unlink: (account: LinkedAccount) =>
    http.delete(`/linked-accounts/${account.providerName}`),
})
