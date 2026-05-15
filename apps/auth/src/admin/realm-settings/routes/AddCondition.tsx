/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/AddCondition.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type NewClientPolicyConditionParams = {
  realm: string;
  policyName: string;
};

const NewClientPolicyCondition = lazy(
  () => import("../NewClientPolicyCondition"),
);

export const NewClientPolicyConditionRoute: AppRouteObject = {
  path: "/:realm/realm-settings/client-policies/:policyName/edit-policy/create-condition",
  element: <NewClientPolicyCondition />,
  breadcrumb: (t) => t("addCondition"),
  handle: {
    access: "manage-clients",
  },
};

export const toNewClientPolicyCondition = (
  params: NewClientPolicyConditionParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewClientPolicyConditionRoute.path, params),
});
