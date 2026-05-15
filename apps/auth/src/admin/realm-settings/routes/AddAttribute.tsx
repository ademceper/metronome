/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/AddAttribute.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type AddAttributeParams = {
  realm: string;
};

const NewAttributeSettings = lazy(() => import("../NewAttributeSettings"));

export const AddAttributeRoute: AppRouteObject = {
  path: "/:realm/realm-settings/user-profile/attributes/add-attribute",
  element: <NewAttributeSettings />,
  breadcrumb: (t) => t("createAttribute"),
  handle: {
    access: "manage-realm",
  },
};

export const toAddAttribute = (params: AddAttributeParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddAttributeRoute.path, params),
});
