/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/routes/IdentityProviderOidc.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type IdentityProviderOidcParams = { realm: string };

const AddOpenIdConnect = lazy(() => import("../add/AddOpenIdConnect"));

export const IdentityProviderOidcRoute: AppRouteObject = {
  path: "/:realm/identity-providers/oidc/add",
  element: <AddOpenIdConnect />,
  breadcrumb: (t) => t("addOpenIdProvider"),
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderOidc = (
  params: IdentityProviderOidcParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderOidcRoute.path, params),
});
