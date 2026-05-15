/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/routes/Organizations.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import type { AppRouteObject } from "../../route-utils";
import { generateEncodedPath } from "../../utils/generateEncodedPath";

type OrganizationsRouteParams = {
  realm: string;
};

const OrganizationsSection = lazy(() => import("../OrganizationsSection"));

export const OrganizationsRoute: AppRouteObject = {
  path: "/:realm/organizations",
  element: <OrganizationsSection />,
  breadcrumb: (t) => t("organizationsList"),
  handle: {
    access: "query-groups",
  },
};

export const toOrganizations = (
  params: OrganizationsRouteParams,
): Partial<Path> => {
  const path = OrganizationsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
