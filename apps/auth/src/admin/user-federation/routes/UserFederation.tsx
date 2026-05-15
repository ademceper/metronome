/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/routes/UserFederation.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type UserFederationParams = { realm: string };

const UserFederationSection = lazy(() => import("../UserFederationSection"));

export const UserFederationRoute: AppRouteObject = {
  path: "/:realm/user-federation",
  element: <UserFederationSection />,
  breadcrumb: (t) => t("userFederation"),
  handle: {
    access: "view-realm",
  },
};

export const toUserFederation = (
  params: UserFederationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationRoute.path, params),
});
