/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/routes/ClientScopeTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type ClientScopesTab = "setup" | "evaluate";

export type ClientScopesParams = {
  realm: string;
  clientId: string;
  tab: ClientScopesTab;
};

const ClientDetails = lazy(() => import("../ClientDetails"));

export const ClientScopesRoute: AppRouteObject = {
  path: "/:realm/clients/:clientId/clientScopes/:tab",
  element: <ClientDetails />,
  breadcrumb: (t) => t("clientSettings"),
  handle: {
    access: "view-clients",
  },
};

export const toClientScopesTab = (
  params: ClientScopesParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(ClientScopesRoute.path, params),
});
