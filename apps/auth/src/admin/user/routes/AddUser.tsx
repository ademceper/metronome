/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/routes/AddUser.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";

import type { AppRouteObject } from "../../routes";

export type AddUserParams = { realm: string };

const CreateUser = lazy(() => import("../CreateUser"));

export const AddUserRoute: AppRouteObject = {
  path: "/:realm/users/add-user",
  element: <CreateUser />,
  breadcrumb: (t) => t("createUser"),
  handle: {
    access: ["query-users", "query-groups"],
  },
};

export const toAddUser = (params: AddUserParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddUserRoute.path, params),
});
