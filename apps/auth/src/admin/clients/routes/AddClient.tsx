/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/routes/AddClient.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type AddClientParams = { realm: string };

const NewClientForm = lazy(() => import("../add/NewClientForm"));

export const AddClientRoute: AppRouteObject = {
  path: "/:realm/clients/add-client",
  element: <NewClientForm />,
  breadcrumb: (t) => t("createClient"),
  handle: {
    access: "manage-clients",
  },
};

export const toAddClient = (params: AddClientParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddClientRoute.path, params),
});
