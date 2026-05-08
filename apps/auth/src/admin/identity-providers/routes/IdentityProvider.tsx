/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/routes/IdentityProvider.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type IdentityProviderTab =
  | "settings"
  | "mappers"
  | "permissions"
  | "events";

export type IdentityProviderParams = {
  realm: string;
  providerId: string;
  alias: string;
  tab: IdentityProviderTab;
};

const DetailSettings = lazy(() => import("../add/DetailSettings"));

export const IdentityProviderRoute: AppRouteObject = {
  path: "/:realm/identity-providers/:providerId/:alias/:tab",
  element: <DetailSettings />,
  breadcrumb: (t) => t("providerDetails"),
  handle: {
    access: "view-identity-providers",
  },
};

export const toIdentityProvider = (
  params: IdentityProviderParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderRoute.path, params),
});
