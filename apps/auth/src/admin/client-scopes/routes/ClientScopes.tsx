/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/client-scopes/routes/ClientScopes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type ClientScopesParams = { realm: string };

const ClientScopesSection = lazy(() => import("../ClientScopesSection"));

export const ClientScopesRoute: AppRouteObject = {
  path: "/:realm/client-scopes",
  element: <ClientScopesSection />,
  breadcrumb: (t) => t("clientScopeList"),
  handle: {
    access: "view-clients",
  },
};

export const toClientScopes = (params: ClientScopesParams): Partial<Path> => ({
  pathname: generateEncodedPath(ClientScopesRoute.path, params),
});
