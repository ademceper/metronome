/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/NewAttributesGroup.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type NewAttributesGroupParams = {
  realm: string;
};

const AttributesGroupDetails = lazy(
  () => import("../user-profile/AttributesGroupDetails"),
);

export const NewAttributesGroupRoute: AppRouteObject = {
  path: "/:realm/realm-settings/user-profile/attributesGroup/new",
  element: <AttributesGroupDetails />,
  breadcrumb: (t) => t("createGroupText"),
  handle: {
    access: "view-realm",
  },
};

export const toNewAttributesGroup = (
  params: NewAttributesGroupParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewAttributesGroupRoute.path, params),
});
