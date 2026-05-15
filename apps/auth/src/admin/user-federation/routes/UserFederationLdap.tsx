/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/routes/UserFederationLdap.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type UserFederationLdapTab = "settings" | "mappers";

export type UserFederationLdapParams = {
  realm: string;
  id: string;
  tab?: UserFederationLdapTab;
};

const UserFederationLdapSettings = lazy(
  () => import("../UserFederationLdapSettings"),
);

export const UserFederationLdapRoute: AppRouteObject = {
  path: "/:realm/user-federation/ldap/:id",
  element: <UserFederationLdapSettings />,
  breadcrumb: (t) => t("settings"),
  handle: {
    access: "view-realm",
  },
};

export const UserFederationLdapWithTabRoute: AppRouteObject = {
  ...UserFederationLdapRoute,
  path: "/:realm/user-federation/ldap/:id/:tab",
};

export const toUserFederationLdap = (
  params: UserFederationLdapParams,
): Partial<Path> => {
  const path = params.tab
    ? UserFederationLdapWithTabRoute.path
    : UserFederationLdapRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
