import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query"
import { useMemo } from "react"
import { useEnvironment } from "../../../shared/keycloak-ui-shared"
import type { AccountEnvironment } from "../.."
import { type AccountClient, createClient } from "./client"
import type { LinkedAccountQueryParams } from "./endpoints/linked-accounts"
import { accountKeys } from "./keys"
import { accountQueries } from "./queries"
import type {
  LinkedAccountRepresentation,
  Permission,
  Resource,
  UserRepresentation,
} from "./types"

/**
 * Root SDK hook. Every domain hook below derives its work from here,
 * never from raw `fetch` or endpoint modules.
 */
export const useAccountClient = (): AccountClient => {
  const context = useEnvironment<AccountEnvironment>()
  return useMemo(() => createClient(context), [context])
}

/* Read hooks ------------------------------------------------------- */

export const usePersonalInfo = () => {
  const client = useAccountClient()
  return useQuery(accountQueries.personalInfo(client))
}

export const useSupportedLocales = () => {
  const client = useAccountClient()
  return useQuery(accountQueries.supportedLocales(client))
}

export const useApplications = () => {
  const client = useAccountClient()
  return useQuery(accountQueries.applications(client))
}

export const useCredentials = () => {
  const client = useAccountClient()
  return useQuery(accountQueries.credentials(client))
}

export const useDevices = () => {
  const client = useAccountClient()
  return useQuery(accountQueries.devices(client))
}

export const useGroups = () => {
  const client = useAccountClient()
  return useQuery(accountQueries.groups(client))
}

export const useUserOrganizations = () => {
  const client = useAccountClient()
  return useQuery(accountQueries.organizations(client))
}

export const useLinkedAccounts = (params: LinkedAccountQueryParams) => {
  const client = useAccountClient()
  return useQuery(accountQueries.linkedAccounts(client, params))
}

export const useResources = (
  params: { query: Record<string, string>; isShared: boolean },
  options?: { withPermissionRequests?: boolean },
) => {
  const client = useAccountClient()
  return useQuery(accountQueries.resources(client, params, options))
}

export const useOid4VciIssuer = () => {
  const client = useAccountClient()
  return useQuery(accountQueries.oid4vciIssuer(client))
}

/* Mutation hooks --------------------------------------------------- */

type MutationOpts<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
>

export const useSavePersonalInfo = (
  options?: MutationOpts<void, UserRepresentation>,
) => {
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
  options?: MutationOpts<unknown, LinkedAccountRepresentation>,
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
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.resources() }),
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
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.resources() }),
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
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.resources() }),
    ...options,
  })
}
