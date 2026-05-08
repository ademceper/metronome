/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/client-scopes/routes/ClientScope.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type ClientScopeTab = "settings" | "mappers" | "scope" | "events";

export type ClientScopeParams = {
  realm: string;
  id: string;
  tab: ClientScopeTab;
};

const EditClientScope = lazy(() => import("../EditClientScope"));

export const ClientScopeRoute: AppRouteObject = {
  path: "/:realm/client-scopes/:id/:tab",
  element: <EditClientScope />,
  breadcrumb: (t) => t("clientScopeDetails"),
  handle: {
    access: "view-clients",
  },
};

export const toClientScope = (params: ClientScopeParams): Partial<Path> => {
  const path = ClientScopeRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
