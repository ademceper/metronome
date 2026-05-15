/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/routes/IdentityProviderJWTAuthorizationGrant.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type IdentityProviderJWTAuthorizationGrantParams = { realm: string };

const AddJWTAuthorizationGrant = lazy(
  () => import("../add/AddJWTAuthorizationGrant"),
);

export const IdentityProviderJWTAuthorizationGrantRoute: AppRouteObject = {
  path: "/:realm/identity-providers/jwt-authorization-grant/add",
  element: <AddJWTAuthorizationGrant />,
  breadcrumb: (t) => t("addJWTAuthorizationGrantProvider"),
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderJWTAuthorizationGrant = (
  params: IdentityProviderJWTAuthorizationGrantParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(
    IdentityProviderJWTAuthorizationGrantRoute.path,
    params,
  ),
});
