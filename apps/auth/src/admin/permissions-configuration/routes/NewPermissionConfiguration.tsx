/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/routes/NewPermissionConfiguration.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type NewPermissionConfigurationParams = {
  realm: string;
  permissionClientId: string;
  resourceType: string;
};

const PermissionConfigurationDetails = lazy(
  () => import("../permission-configuration/PermissionConfigurationDetails"),
);

export const NewPermissionConfigurationRoute: AppRouteObject = {
  path: "/:realm/permissions/:permissionClientId/permission/new/:resourceType",
  element: <PermissionConfigurationDetails />,
  breadcrumb: (t) => t("createPermission"),
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
