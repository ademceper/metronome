/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/routes/IdentityProviders.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type IdentityProvidersParams = { realm: string };

const IdentityProvidersSection = lazy(
  () => import("../IdentityProvidersSection"),
);

export const IdentityProvidersRoute: AppRouteObject = {
  path: "/:realm/identity-providers",
  element: <IdentityProvidersSection />,
  breadcrumb: (t) => t("identityProviders"),
  handle: {
    access: "view-identity-providers",
  },
};

export const toIdentityProviders = (
  params: IdentityProvidersParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProvidersRoute.path, params),
});
