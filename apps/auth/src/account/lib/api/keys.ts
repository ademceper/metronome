import type { LinkedAccountQueryParams } from "./endpoints"

/**
 * Centralised TanStack Query keys. Routes never touch raw key arrays —
 * always go through this factory so cache invalidation stays consistent
 * across the app.
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
