/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/routes/UserFederationKerberos.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type UserFederationKerberosParams = {
  realm: string;
  id: string;
};

const UserFederationKerberosSettings = lazy(
  () => import("../UserFederationKerberosSettings"),
);

export const UserFederationKerberosRoute: AppRouteObject = {
  path: "/:realm/user-federation/kerberos/:id",
  element: <UserFederationKerberosSettings />,
  breadcrumb: (t) => t("settings"),
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationKerberos = (
  params: UserFederationKerberosParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationKerberosRoute.path, params),
});
