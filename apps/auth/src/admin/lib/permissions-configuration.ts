// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generate-encoded-path";

// ─── from permissions-configuration/paths/NewPermissionConfiguration.ts ─────
export type NewPermissionConfigurationParams = {
  realm: string;
  permissionClientId: string;
  resourceType: string;
};
export const NewPermissionConfigurationRoute = {
  path: "/:realm/permissions/:permissionClientId/permission/new/:resourceType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const toCreatePermissionConfiguration = (
  params: NewPermissionConfigurationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewPermissionConfigurationRoute.path, params),
});

// ─── from permissions-configuration/paths/NewPermissionPolicy.ts ─────
export type NewPermissionPolicyDetailsParams = {
  realm: string;
  permissionClientId: string;
  policyType: string;
};
export const NewPermissionPolicyRoute = {
  path: "/:realm/permissions/:permissionClientId/policies/new/:policyType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const toCreatePermissionPolicy = (
  params: NewPermissionPolicyDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewPermissionPolicyRoute.path, params),
});

// ─── from permissions-configuration/paths/PermissionConfigurationDetails.ts ─────
export type PermissionConfigurationDetailsParams = {
  realm: string;
  permissionClientId: string;
  permissionId: string;
  resourceType: string;
};
export const PermissionConfigurationDetailRoute = {
  path: "/:realm/permissions/:permissionClientId/permission/:permissionId/:resourceType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const toPermissionConfigurationDetails = (
  params: PermissionConfigurationDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(
    PermissionConfigurationDetailRoute.path,
    params,
  ),
});

// ─── from permissions-configuration/paths/PermissionPolicyDetails.ts ─────
export type PermissionPolicyDetailsParams = {
  realm: string;
  permissionClientId: string;
  policyId: string;
  policyType: string;
};
export const PermissionPolicyDetailsRoute = {
  path: "/:realm/permissions/:permissionClientId/policies/:policyId/:policyType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const toPermissionPolicyDetails = (
  params: PermissionPolicyDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionPolicyDetailsRoute.path, params),
});

// ─── from permissions-configuration/paths/PermissionsConfiguration.ts ─────
export type PermissionsConfigurationParams = { realm: string };
export const PermissionsConfigurationRoute = {
  path: "/:realm/permissions",
  handle: {
    access: ["view-realm", "view-clients", "view-users"],
  },
};

export const toPermissionsConfiguration = (
  params: PermissionsConfigurationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionsConfigurationRoute.path, params),
});

// ─── from permissions-configuration/paths/PermissionsConfigurationTabs.ts ─────
export type PermissionsConfigurationTabs =
  | "permissions"
  | "policies"
  | "evaluation";

export type PermissionsConfigurationTabsParams = {
  realm: string;
  permissionClientId: string;
  tab: PermissionsConfigurationTabs;
};
export const PermissionsConfigurationTabsRoute = {
  path: "/:realm/permissions/:permissionClientId/:tab",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("view-realm", "view-clients", "view-users"),
  },
};

export const toPermissionsConfigurationTabs = (
  params: PermissionsConfigurationTabsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionsConfigurationTabsRoute.path, params),
});

// ─── from permissions-configuration/paths/PermissionsPolicies.ts ─────
export type PermissionsPoliciesParams = {
  realm: string;
  permissionClientId: string;
};
export const PermissionsPoliciesRoute = {
  path: "/:realm/permissions/:permissionClientId/policies",
  handle: {
    access: ["view-realm", "view-clients", "view-users"],
  },
};

export const toPermissionsPolicies = (
  params: PermissionsPoliciesParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionsPoliciesRoute.path, params),
});
