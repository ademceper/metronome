/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/routes/UserFederationsKerberos.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type UserFederationsKerberosParams = { realm: string };

const UserFederationSection = lazy(() => import("../UserFederationSection"));

export const UserFederationsKerberosRoute: AppRouteObject = {
  path: "/:realm/user-federation/kerberos",
  element: <UserFederationSection />,
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationsKerberos = (
  params: UserFederationsKerberosParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationsKerberosRoute.path, params),
});
