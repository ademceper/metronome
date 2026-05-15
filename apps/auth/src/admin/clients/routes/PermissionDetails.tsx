/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/routes/PermissionDetails.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";
import type { PermissionType } from "./NewPermission";

export type PermissionDetailsParams = {
  realm: string;
  id: string;
  permissionType: string | PermissionType;
  permissionId: string;
};

const PermissionDetails = lazy(
  () => import("../authorization/PermissionDetails"),
);

export const PermissionDetailsRoute: AppRouteObject = {
  path: "/:realm/clients/:id/authorization/permission/:permissionType/:permissionId",
  element: <PermissionDetails />,
  breadcrumb: (t) => t("permissionDetails"),
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const toPermissionDetails = (
  params: PermissionDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionDetailsRoute.path, params),
});
