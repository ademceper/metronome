/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/EditAttributesGroup.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type EditAttributesGroupParams = {
  realm: string;
  name: string;
};

const AttributesGroupDetails = lazy(
  () => import("../user-profile/AttributesGroupDetails"),
);

export const EditAttributesGroupRoute: AppRouteObject = {
  path: "/:realm/realm-settings/user-profile/attributesGroup/edit/:name",
  element: <AttributesGroupDetails />,
  breadcrumb: (t) => t("editGroupText"),
  handle: {
    access: "view-realm",
  },
};

export const toEditAttributesGroup = (
  params: EditAttributesGroupParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(EditAttributesGroupRoute.path, params),
});
