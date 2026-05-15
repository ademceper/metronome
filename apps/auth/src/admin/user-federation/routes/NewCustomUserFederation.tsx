/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/routes/NewCustomUserFederation.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";

import type { AppRouteObject } from "../../route-utils";

export type NewCustomUserFederationRouteParams = {
  realm: string;
  providerId: string;
};

const CustomProviderSettings = lazy(
  () => import("../custom/CustomProviderSettings"),
);

export const NewCustomUserFederationRoute: AppRouteObject = {
  path: "/:realm/user-federation/:providerId/new",
  element: <CustomProviderSettings />,
  breadcrumb: (t) => t("addCustomProvider"),
  handle: {
    access: "view-realm",
  },
};

export const toNewCustomUserFederation = (
  params: NewCustomUserFederationRouteParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewCustomUserFederationRoute.path, params),
});
