import { queryOptions } from "@tanstack/react-query"
import type {
  BaseEnvironment,
  KeycloakContext,
} from "../../../shared/keycloak-ui-shared"
import { accountKeys } from "./keys"
import {
  getApplications,
  getCredentials,
  getDevices,
  getGroups,
  getLinkedAccounts,
  type LinkedAccountQueryParams,
  getPermissionRequests,
  getPersonalInfo,
  getSupportedLocales,
  getUserOrganizations,
} from "./methods"
import { fetchPermission, fetchResources, getIssuer } from "./resources"

type Ctx = KeycloakContext<BaseEnvironment>

/**
 * `queryOptions` factories — TanStack Query v5 idiom.
 *
 * Each factory returns an object that can be spread into `useQuery`,
 * `useSuspenseQuery`, or `queryClient.fetchQuery` while keeping the
 * data type strongly inferred end-to-end.
 */
export const accountQueries = {
  personalInfo: (context: Ctx) =>
    queryOptions({
      queryKey: accountKeys.personalInfo(),
      queryFn: ({ signal }) => getPersonalInfo({ signal, context }),
    }),

  supportedLocales: (context: Ctx) =>
    queryOptions({
      queryKey: accountKeys.supportedLocales(),
      queryFn: ({ signal }) => getSupportedLocales({ signal, context }),
    }),

  applications: (context: Ctx) =>
    queryOptions({
      queryKey: accountKeys.applications(),
      queryFn: ({ signal }) => getApplications({ signal, context }),
    }),

  credentials: (context: Ctx) =>
    queryOptions({
      queryKey: accountKeys.credentials(),
      queryFn: ({ signal }) => getCredentials({ signal, context }),
    }),

  devices: (context: Ctx) =>
    queryOptions({
      queryKey: accountKeys.devices(),
      queryFn: ({ signal }) => getDevices({ signal, context }),
    }),

  groups: (context: Ctx) =>
    queryOptions({
      queryKey: accountKeys.groups(),
      queryFn: ({ signal }) => getGroups({ signal, context }),
    }),

  organizations: (context: Ctx) =>
    queryOptions({
      queryKey: accountKeys.organizations(),
      queryFn: ({ signal }) => getUserOrganizations({ signal, context }),
    }),

  linkedAccounts: (context: Ctx, params: LinkedAccountQueryParams) =>
    queryOptions({
      queryKey: accountKeys.linkedAccounts(params),
      queryFn: ({ signal }) => getLinkedAccounts({ signal, context }, params),
    }),

  resources: (
    context: Ctx,
    params: { query: Record<string, string>; isShared: boolean },
    options?: { withPermissionRequests?: boolean }
  ) =>
    queryOptions({
      queryKey: accountKeys.resources(params),
      queryFn: async ({ signal }) => {
        const result = await fetchResources(
          { signal, context },
          params.query,
          params.isShared
        )
        if (options?.withPermissionRequests && !params.isShared) {
          await Promise.all(
            result.data.map(async (r) => {
              r.shareRequests = await getPermissionRequests(r._id, {
                signal,
                context,
              })
            })
          )
        }
        return result
      },
    }),

  resourcePermissions: (context: Ctx, resourceId: string) =>
    queryOptions({
      queryKey: accountKeys.resourcePermissions(resourceId),
      queryFn: ({ signal }) => fetchPermission({ signal, context }, resourceId),
    }),

  oid4vciIssuer: (context: Ctx) =>
    queryOptions({
      queryKey: accountKeys.oid4vciIssuer(),
      queryFn: () => getIssuer(context),
    }),
}
