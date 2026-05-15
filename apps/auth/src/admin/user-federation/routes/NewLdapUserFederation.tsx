/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/routes/NewLdapUserFederation.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type NewLdapUserFederationParams = { realm: string };

const CreateUserFederationLdapSettings = lazy(
  () => import("../CreateUserFederationLdapSettings"),
);

export const NewLdapUserFederationRoute: AppRouteObject = {
  path: "/:realm/user-federation/ldap/new",
  element: <CreateUserFederationLdapSettings />,
  breadcrumb: (t) => t("addProvider", { provider: "LDAP", count: 1 }),
  handle: {
    access: "view-realm",
  },
};

export const toNewLdapUserFederation = (
  params: NewLdapUserFederationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewLdapUserFederationRoute.path, params),
});
