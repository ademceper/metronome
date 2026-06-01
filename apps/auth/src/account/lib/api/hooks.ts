import {
  type UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { useMemo } from "react"
import { useEnvironment } from "../../../shared/keycloak-ui-shared"
import type { AccountEnvironment } from "../.."
import { type AccountClient, createClient } from "../api-client"
import type {
  LinkedAccount,
  LinkedAccountQueryParams,
} from "../resources/linked-accounts"
import type { User } from "../resources/personal-info"
import type { Permission, Resource } from "../resources/shared-resources"
import { accountKeys, accountQueries } from "./queries"

/* ─── Root SDK hook ────────────────────────────────────────────────── */

export const useAccountClient = (): AccountClient => {
  const context = useEnvironment<AccountEnvironment>()
  return useMemo(() => createClient(context), [context])
}

/* ─── Read hooks ───────────────────────────────────────────────────── */

export const usePersonalInfo = () =>
  useQuery(accountQueries.personalInfo(useAccountClient()))

export const useSupportedLocales = () =>
  useQuery(accountQueries.supportedLocales(useAccountClient()))

export const useApplications = () =>
  useQuery(accountQueries.applications(useAccountClient()))

export const useCredentials = () =>
  useQuery(accountQueries.credentials(useAccountClient()))

export const useDevices = () =>
  useQuery(accountQueries.devices(useAccountClient()))

export const useGroups = () =>
  useQuery(accountQueries.groups(useAccountClient()))

export const useUserOrganizations = () =>
  useQuery(accountQueries.organizations(useAccountClient()))

export const useLinkedAccounts = (params: LinkedAccountQueryParams) =>
  useQuery(accountQueries.linkedAccounts(useAccountClient(), params))

export const useResources = (
  params: { query: Record<string, string>; isShared: boolean },
  options?: { withPermissionRequests?: boolean },
) => useQuery(accountQueries.resources(useAccountClient(), params, options))

export const useOid4VciIssuer = () =>
  useQuery(accountQueries.oid4vciIssuer(useAccountClient()))

/* ─── Mutation hooks ───────────────────────────────────────────────── */

type MutationOpts<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
>

export const useSavePersonalInfo = (options?: MutationOpts<void, User>) => {
  const client = useAccountClient()
  return useMutation({
    mutationFn: (info) => client.personalInfo.update(info),
    ...options,
  })
}

export const useDeleteConsent = (options?: MutationOpts<unknown, string>) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => client.applications.deleteConsent(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.applications() }),
    ...options,
  })
}

export const useDeleteSession = (
  options?: MutationOpts<unknown, string | undefined>,
) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => client.devices.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.devices() }),
    ...options,
  })
}

export const useUnLinkAccount = (
  options?: MutationOpts<unknown, LinkedAccount>,
) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (account) => client.linkedAccounts.unlink(account),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.linkedAccounts() }),
    ...options,
  })
}

export const useUpdatePermissions = (
  options?: MutationOpts<
    unknown,
    { resourceId: string; permissions: Permission[] }
  >,
) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ resourceId, permissions }) =>
      client.resources.updatePermissions(resourceId, permissions),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.resources() }),
    ...options,
  })
}

export const useUpdateRequest = (
  options?: MutationOpts<
    unknown,
    { resourceId: string; username: string; scopes: string[] }
  >,
) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ resourceId, username, scopes }) =>
      client.resources.share(resourceId, username, scopes),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.resources() }),
    ...options,
  })
}

export const useUnshareResource = (
  options?: MutationOpts<unknown, Resource>,
) => {
  const client = useAccountClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (resource) => {
      const perms = await client.resources.permissions(resource._id)
      const cleared = perms.map(
        ({ username }) => ({ username, scopes: [] }) as Permission,
      )
      await client.resources.updatePermissions(resource._id, cleared)
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: accountKeys.resources() }),
    ...options,
  })
}
