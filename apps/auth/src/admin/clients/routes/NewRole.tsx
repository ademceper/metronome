/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/routes/NewRole.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type NewRoleParams = { realm: string; clientId: string };

const CreateClientRole = lazy(() => import("../roles/CreateClientRole"));

export const NewRoleRoute: AppRouteObject = {
  path: "/:realm/clients/:clientId/roles/new",
  element: <CreateClientRole />,
  breadcrumb: (t) => t("createRole"),
  handle: {
    access: "query-clients",
  },
};

export const toCreateRole = (params: NewRoleParams): Partial<Path> => ({
  pathname: generateEncodedPath(NewRoleRoute.path, params),
});
