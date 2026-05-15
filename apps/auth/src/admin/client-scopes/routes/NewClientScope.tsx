/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/client-scopes/routes/NewClientScope.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type NewClientScopeParams = { realm: string };

const CreateClientScope = lazy(() => import("../CreateClientScope"));

export const NewClientScopeRoute: AppRouteObject = {
  path: "/:realm/client-scopes/new",
  element: <CreateClientScope />,
  breadcrumb: (t) => t("createClientScope"),
  handle: {
    access: "manage-clients",
  },
};

export const toNewClientScope = (
  params: NewClientScopeParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewClientScopeRoute.path, params),
});
