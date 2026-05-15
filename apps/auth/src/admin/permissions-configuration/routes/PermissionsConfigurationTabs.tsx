/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/routes/PermissionsConfigurationTabs.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type PermissionsConfigurationTabs =
  | "permissions"
  | "policies"
  | "evaluation";

export type PermissionsConfigurationTabsParams = {
  realm: string;
  permissionClientId: string;
  tab: PermissionsConfigurationTabs;
};

const PermissionsConfigurationSection = lazy(
  () => import("../PermissionsConfigurationSection"),
);

export const PermissionsConfigurationTabsRoute: AppRouteObject = {
  path: "/:realm/permissions/:permissionClientId/:tab",
  element: <PermissionsConfigurationSection />,
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
