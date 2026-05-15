/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/AddClientPolicy.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type AddClientPolicyParams = { realm: string };

const NewClientPolicy = lazy(() => import("../NewClientPolicy"));

export const AddClientPolicyRoute: AppRouteObject = {
  path: "/:realm/realm-settings/client-policies/policies/add-client-policy",
  element: <NewClientPolicy />,
  breadcrumb: (t) => t("createPolicy"),
  handle: {
    access: "manage-clients",
  },
};

export const toAddClientPolicy = (
  params: AddClientPolicyParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(AddClientPolicyRoute.path, params),
});
