/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/EditClientPolicy.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type EditClientPolicyParams = {
  realm: string;
  policyName: string;
};

const NewClientPolicy = lazy(() => import("../NewClientPolicy"));

export const EditClientPolicyRoute: AppRouteObject = {
  path: "/:realm/realm-settings/client-policies/:policyName/edit-policy",
  element: <NewClientPolicy />,
  breadcrumb: (t) => t("policyDetails"),
  handle: {
    access: "manage-realm",
  },
};

export const toEditClientPolicy = (
  params: EditClientPolicyParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(EditClientPolicyRoute.path, params),
});
