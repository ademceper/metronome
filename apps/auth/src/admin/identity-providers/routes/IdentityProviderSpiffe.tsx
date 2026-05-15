/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/routes/IdentityProviderSpiffe.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type IdentityProviderSpiffeParams = { realm: string };

const AddSpiffeConnect = lazy(() => import("../add/AddSpiffeConnect"));

export const IdentityProviderSpiffeRoute: AppRouteObject = {
  path: "/:realm/identity-providers/spiffe/add",
  element: <AddSpiffeConnect />,
  breadcrumb: (t) => t("addSpiffeProvider"),
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderSpiffe = (
  params: IdentityProviderSpiffeParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderSpiffeRoute.path, params),
});
