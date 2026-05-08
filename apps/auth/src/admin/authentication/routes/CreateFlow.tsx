/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/routes/CreateFlow.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type CreateFlowParams = { realm: string };

const CreateFlow = lazy(() => import("../form/CreateFlow"));

export const CreateFlowRoute: AppRouteObject = {
  path: "/:realm/authentication/flows/create",
  element: <CreateFlow />,
  breadcrumb: (t) => t("createFlow"),
  handle: {
    access: "manage-authorization",
  },
};

export const toCreateFlow = (params: CreateFlowParams): Partial<Path> => ({
  pathname: generateEncodedPath(CreateFlowRoute.path, params),
});
