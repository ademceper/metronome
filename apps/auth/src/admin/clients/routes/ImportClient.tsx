/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/routes/ImportClient.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type ImportClientParams = { realm: string };

const ImportForm = lazy(() => import("../import/ImportForm"));

export const ImportClientRoute: AppRouteObject = {
  path: "/:realm/clients/import-client",
  element: <ImportForm />,
  breadcrumb: (t) => t("importClient"),
  handle: {
    access: "manage-clients",
  },
};

export const toImportClient = (params: ImportClientParams): Partial<Path> => ({
  pathname: generateEncodedPath(ImportClientRoute.path, params),
});
