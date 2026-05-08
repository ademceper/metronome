/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/AddExecutor.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type AddExecutorParams = {
  realm: string;
  profileName: string;
};

const ExecutorForm = lazy(() => import("../ExecutorForm"));

export const AddExecutorRoute: AppRouteObject = {
  path: "/:realm/realm-settings/client-policies/:profileName/add-executor",
  element: <ExecutorForm />,
  breadcrumb: (t) => t("addExecutor"),
  handle: {
    access: "manage-realm",
  },
};

export const toAddExecutor = (params: AddExecutorParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddExecutorRoute.path, params),
});
