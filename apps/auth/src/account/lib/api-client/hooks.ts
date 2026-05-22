import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query"
import type { AccountEnvironment } from "../.."
import { useEnvironment } from "../../../shared/keycloak-ui-shared"
import { deleteConsent } from "./endpoints/applications"
import { deleteSession } from "./endpoints/devices"
import {
  type LinkedAccountQueryParams,
  unLinkAccount,
} from "./endpoints/linked-accounts"
import { savePersonalInfo } from "./endpoints/personal-info"
import {
  fetchPermission,
  updatePermissions,
  updateRequest,
} from "./endpoints/resources"
import { accountKeys } from "./keys"
import { accountQueries } from "./queries"
import type {
  LinkedAccountRepresentation,
  Permission,
  Resource,
} from "./types"

/**
 * Read hooks — each picks up KeycloakContext via `useEnvironment` so
 * routes don't need to thread it manually.
 */
export const usePersonalInfo = () => {
  const context = useEnvironment<AccountEnvironment>()
  return useQuery(accountQueries.personalInfo(context))
}

export const useSupportedLocales = () => {
  const context = useEnvironment<AccountEnvironment>()
  return useQuery(accountQueries.supportedLocales(context))
}

export const useApplications = () => {
  const context = useEnvironment<AccountEnvironment>()
  return useQuery(accountQueries.applications(context))
}

export const useCredentials = () => {
  const context = useEnvironment<AccountEnvironment>()
  return useQuery(accountQueries.credentials(context))
}

export const useDevices = () => {
  const context = useEnvironment<AccountEnvironment>()
  return useQuery(accountQueries.devices(context))
}

export const useGroups = () => {
  const context = useEnvironment<AccountEnvironment>()
  return useQuery(accountQueries.groups(context))
}

export const useUserOrganizations = () => {
  const context = useEnvironment<AccountEnvironment>()
  return useQuery(accountQueries.organizations(context))
}

export const useLinkedAccounts = (params: LinkedAccountQueryParams) => {
  const context = useEnvironment<AccountEnvironment>()
  return useQuery(accountQueries.linkedAccounts(context, params))
}

export const useResources = (
  params: { query: Record<string, string>; isShared: boolean },
  options?: { withPermissionRequests?: boolean }
) => {
  const context = useEnvironment<AccountEnvironment>()
  return useQuery(accountQueries.resources(context, params, options))
}

export const useOid4VciIssuer = () => {
  const context = useEnvironment<AccountEnvironment>()
  return useQuery(accountQueries.oid4vciIssuer(context))
}

/**
 * Mutation hooks — return `useMutation` results, so callers still get
 * the full mutation API (mutate, mutateAsync, isPending, …) and can pass
 * onSuccess/onError per call site.
 */

type MutationOpts<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
>

export const useSavePersonalInfo = (
  options?: MutationOpts<void, Parameters<typeof savePersonalInfo>[1]>
) => {
  const context = useEnvironment<AccountEnvironment>()
  return useMutation({
    mutationFn: (info) => savePersonalInfo(context, info),
    ...options,
  })
}

export const useDeleteConsent = (options?: MutationOpts<unknown, string>) => {
  const context = useEnvironment<AccountEnvironment>()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteConsent(context, id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.applications() }),
    ...options,
  })
}

export const useDeleteSession = (
  options?: MutationOpts<unknown, string | undefined>
) => {
  const context = useEnvironment<AccountEnvironment>()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteSession(context, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.devices() }),
    ...options,
  })
}

export const useUnLinkAccount = (
  options?: MutationOpts<unknown, LinkedAccountRepresentation>
) => {
  const context = useEnvironment<AccountEnvironment>()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (account) => unLinkAccount(context, account),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.linkedAccounts() }),
    ...options,
  })
}

export const useUpdatePermissions = (
  options?: MutationOpts<unknown, { resourceId: string; permissions: Permission[] }>
) => {
  const context = useEnvironment<AccountEnvironment>()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ resourceId, permissions }) =>
      updatePermissions(context, resourceId, permissions),
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.resources() }),
    ...options,
  })
}

export const useUpdateRequest = (
  options?: MutationOpts<
    unknown,
    { resourceId: string; username: string; scopes: string[] }
  >
) => {
  const context = useEnvironment<AccountEnvironment>()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ resourceId, username, scopes }) =>
      updateRequest(context, resourceId, username, scopes),
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.resources() }),
    ...options,
  })
}

export const useUnshareResource = (
  options?: MutationOpts<unknown, Resource>
) => {
  const context = useEnvironment<AccountEnvironment>()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (resource) => {
      const perms = await fetchPermission({ context }, resource._id)
      const cleared = perms.map(
        ({ username }) => ({ username, scopes: [] }) as Permission
      )
      await updatePermissions(context, resource._id, cleared)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.resources() }),
    ...options,
  })
}
