/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/routes/UserFederationLdapMapper.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type UserFederationLdapMapperParams = {
  realm: string;
  id: string;
  mapperId: string;
};

const LdapMapperDetails = lazy(
  () => import("../ldap/mappers/LdapMapperDetails"),
);

export const UserFederationLdapMapperRoute: AppRouteObject = {
  path: "/:realm/user-federation/ldap/:id/mappers/:mapperId",
  element: <LdapMapperDetails />,
  breadcrumb: (t) => t("mappingDetails"),
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationLdapMapper = (
  params: UserFederationLdapMapperParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationLdapMapperRoute.path, params),
});
