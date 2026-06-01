import { queryOptions } from "@tanstack/react-query"
import type { AccountClient } from "../api-client"
import type { LinkedAccountQueryParams } from "../resources/linked-accounts"

/**
 * TanStack Query keys + `queryOptions()` factories — co-located per
 * [tkdodo's recommendation](https://tkdodo.eu/blog/effective-react-query-keys).
 *
 * `accountKeys` are the canonical cache identifiers; `accountQueries`
 * return `queryOptions` objects that can be spread into `useQuery`,
 * `useSuspenseQuery`, or `queryClient.fetchQuery` while keeping the
 * data type strongly inferred end-to-end.
 */

export const accountKeys = {
  all: ["account"] as const,

  personalInfo: () => [...accountKeys.all, "personal-info"] as const,
  supportedLocales: () => [...accountKeys.all, "supported-locales"] as const,

  applications: () => [...accountKeys.all, "applications"] as const,
  credentials: () => [...accountKeys.all, "credentials"] as const,
  devices: () => [...accountKeys.all, "devices"] as const,
  groups: () => [...accountKeys.all, "groups"] as const,
  organizations: () => [...accountKeys.all, "organizations"] as const,

  linkedAccounts: (params?: LinkedAccountQueryParams) =>
    params
      ? ([...accountKeys.all, "linked-accounts", params] as const)
      : ([...accountKeys.all, "linked-accounts"] as const),

  resources: (params?: { isShared: boolean; query: Record<string, string> }) =>
    params
      ? ([...accountKeys.all, "resources", params] as const)
      : ([...accountKeys.all, "resources"] as const),
  resourcePermissions: (resourceId: string) =>
    [...accountKeys.all, "resources", resourceId, "permissions"] as const,

  oid4vciIssuer: () => [...accountKeys.all, "oid4vci", "issuer"] as const,
}

export const accountQueries = {
  personalInfo: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.personalInfo(),
      queryFn: ({ signal }) => client.personalInfo.get({ signal }),
    }),

  supportedLocales: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.supportedLocales(),
      queryFn: ({ signal }) => client.personalInfo.supportedLocales({ signal }),
    }),

  applications: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.applications(),
      queryFn: ({ signal }) => client.applications.list({ signal }),
    }),

  credentials: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.credentials(),
      queryFn: ({ signal }) => client.credentials.list({ signal }),
    }),

  devices: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.devices(),
      queryFn: ({ signal }) => client.devices.list({ signal }),
    }),

  groups: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.groups(),
      queryFn: ({ signal }) => client.groups.list({ signal }),
    }),

  organizations: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.organizations(),
      queryFn: ({ signal }) => client.organizations.list({ signal }),
    }),

  linkedAccounts: (client: AccountClient, params: LinkedAccountQueryParams) =>
    queryOptions({
      queryKey: accountKeys.linkedAccounts(params),
      queryFn: ({ signal }) => client.linkedAccounts.list(params, { signal }),
    }),

  resources: (
    client: AccountClient,
    params: { query: Record<string, string>; isShared: boolean },
    options?: { withPermissionRequests?: boolean },
  ) =>
    queryOptions({
      queryKey: accountKeys.resources(params),
      queryFn: async ({ signal }) => {
        const result = await client.resources.list(
          params.query,
          params.isShared,
          { signal },
        )
        if (options?.withPermissionRequests && !params.isShared) {
          await Promise.all(
            result.data.map(async (r) => {
              r.shareRequests = await client.resources.permissionRequests(
                r._id,
                { signal },
              )
            }),
          )
        }
        return result
      },
    }),

  resourcePermissions: (client: AccountClient, resourceId: string) =>
    queryOptions({
      queryKey: accountKeys.resourcePermissions(resourceId),
      queryFn: ({ signal }) =>
        client.resources.permissions(resourceId, { signal }),
    }),

  oid4vciIssuer: (client: AccountClient) =>
    queryOptions({
      queryKey: accountKeys.oid4vciIssuer(),
      queryFn: () => client.oid4vci.issuer(),
    }),
}
