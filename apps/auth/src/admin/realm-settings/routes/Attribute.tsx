/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/Attribute.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type AttributeParams = {
  realm: string;
  attributeName: string;
};

const NewAttributeSettings = lazy(() => import("../NewAttributeSettings"));

export const AttributeRoute: AppRouteObject = {
  path: "/:realm/realm-settings/user-profile/attributes/:attributeName/edit-attribute",
  element: <NewAttributeSettings />,
  breadcrumb: (t) => t("editAttribute"),
  handle: {
    access: "manage-realm",
  },
};

export const toAttribute = (params: AttributeParams): Partial<Path> => ({
  pathname: generateEncodedPath(AttributeRoute.path, params),
});
