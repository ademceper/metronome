/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/routes/UserFederationsLdap.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type UserFederationsLdapParams = { realm: string };

const UserFederationSection = lazy(() => import("../UserFederationSection"));

export const UserFederationsLdapRoute: AppRouteObject = {
  path: "/:realm/user-federation/ldap",
  element: <UserFederationSection />,
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationsLdap = (
  params: UserFederationsLdapParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationsLdapRoute.path, params),
});
