/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/routes/IdentityProviderCreate.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type IdentityProviderCreateParams = {
  realm: string;
  providerId: string;
};

const AddIdentityProvider = lazy(() => import("../add/AddIdentityProvider"));

export const IdentityProviderCreateRoute: AppRouteObject = {
  path: "/:realm/identity-providers/:providerId/add",
  element: <AddIdentityProvider />,
  breadcrumb: (t) => t("addProvider"),
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderCreate = (
  params: IdentityProviderCreateParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderCreateRoute.path, params),
});
