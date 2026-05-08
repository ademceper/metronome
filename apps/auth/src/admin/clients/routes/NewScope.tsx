/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/routes/NewScope.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type NewScopeParams = { realm: string; id: string };

const ScopeDetails = lazy(() => import("../authorization/ScopeDetails"));

export const NewScopeRoute: AppRouteObject = {
  path: "/:realm/clients/:id/authorization/scope/new",
  element: <ScopeDetails />,
  breadcrumb: (t) => t("createAuthorizationScope"),
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const toNewScope = (params: NewScopeParams): Partial<Path> => ({
  pathname: generateEncodedPath(NewScopeRoute.path, params),
});
