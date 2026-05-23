import { queryOptions } from "@tanstack/react-query"
import type { AccountClient } from "./client"
import type { LinkedAccountQueryParams } from "./endpoints"
import { accountKeys } from "./keys"

/**
 * `queryOptions` factories — TanStack Query v5 idiom.
 *
 * Each factory takes the `AccountClient` (passed in from a hook or
 * a manual prefetch site) and returns an object spreadable into
 * `useQuery`, `useSuspenseQuery`, or `queryClient.fetchQuery`.
 */
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
