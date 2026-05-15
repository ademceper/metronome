/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/routes/EditOrganization.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type OrganizationTab =
  | "settings"
  | "attributes"
  | "members"
  | "groups"
  | "identityProviders"
  | "events";

export type EditOrganizationParams = {
  realm: string;
  id: string;
  tab: OrganizationTab;
};

const DetailOrganization = lazy(() => import("../DetailOrganization"));

export const EditOrganizationRoute: AppRouteObject = {
  path: "/:realm/organizations/:id/:tab/*",
  element: <DetailOrganization />,
  breadcrumb: (t) => t("organizationDetails"),
  handle: {
    access: "manage-users",
  },
};

export const toEditOrganization = (
  params: EditOrganizationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(EditOrganizationRoute.path, params),
});
