/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/routes/EditMapper.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type IdentityProviderEditMapperParams = {
  realm: string;
  providerId: string;
  alias: string;
  id: string;
};

const AddMapper = lazy(() => import("../add/AddMapper"));

export const IdentityProviderEditMapperRoute: AppRouteObject = {
  path: "/:realm/identity-providers/:providerId/:alias/mappers/:id",
  element: <AddMapper />,
  breadcrumb: (t) => t("editIdPMapper"),
  handle: {
    access: "view-identity-providers",
  },
};

export const toIdentityProviderEditMapper = (
  params: IdentityProviderEditMapperParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderEditMapperRoute.path, params),
});
