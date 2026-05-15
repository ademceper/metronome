/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/routes/PermissionsPolicies.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type PermissionsPoliciesParams = {
  realm: string;
  permissionClientId: string;
};

const PermissionsPoliciesSection = lazy(
  () => import("../PermissionsConfigurationSection"),
);

export const PermissionsPoliciesRoute: AppRouteObject = {
  path: "/:realm/permissions/:permissionClientId/policies",
  element: <PermissionsPoliciesSection />,
  breadcrumb: (t) => t("policies"),
  handle: {
    access: ["view-realm", "view-clients", "view-users"],
  },
};

export const toPermissionsPolicies = (
  params: PermissionsPoliciesParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionsPoliciesRoute.path, params),
});
