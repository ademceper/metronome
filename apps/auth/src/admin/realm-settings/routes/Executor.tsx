/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/Executor.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type ExecutorParams = {
  realm: string;
  profileName: string;
  executorName: string;
};

const ExecutorForm = lazy(() => import("../ExecutorForm"));

export const ExecutorRoute: AppRouteObject = {
  path: "/:realm/realm-settings/client-policies/:profileName/edit-profile/:executorName",
  element: <ExecutorForm />,
  breadcrumb: (t) => t("executorDetails"),
  handle: {
    access: ["manage-realm"],
  },
};

export const toExecutor = (params: ExecutorParams): Partial<Path> => ({
  pathname: generateEncodedPath(ExecutorRoute.path, params),
});
