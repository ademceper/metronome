import type { HttpClient, HttpRequestOptions } from "../api-client"

/* ─── DTOs ────────────────────────────────────────────────────────── */

export interface LinkedAccount {
  connected: boolean
  providerAlias: string
  providerName: string
  displayName: string
  linkedUsername: string
  social: boolean
}

export interface AccountLinkUri {
  accountLinkUri: string
  nonce: string
  hash: string
}

export type LinkedAccountQueryParams = {
  first: number
  max: number
  search?: string
  linked?: boolean
}

/* ─── Endpoints ───────────────────────────────────────────────────── */

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
