/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/routes/AddMapper.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type IdentityProviderAddMapperParams = {
  realm: string;
  providerId: string;
  alias: string;
  tab: string;
};

const AddMapper = lazy(() => import("../add/AddMapper"));

export const IdentityProviderAddMapperRoute: AppRouteObject = {
  path: "/:realm/identity-providers/:providerId/:alias/:tab/create",
  element: <AddMapper />,
  breadcrumb: (t) => t("addIdPMapper"),
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderAddMapper = (
  params: IdentityProviderAddMapperParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderAddMapperRoute.path, params),
});
