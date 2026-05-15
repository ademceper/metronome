/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/EditCondition.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type EditClientPolicyConditionParams = {
  realm: string;
  policyName: string;
  conditionName: string;
};

const NewClientPolicyCondition = lazy(
  () => import("../NewClientPolicyCondition"),
);

export const EditClientPolicyConditionRoute: AppRouteObject = {
  path: "/:realm/realm-settings/client-policies/:policyName/edit-policy/:conditionName/edit-condition",
  element: <NewClientPolicyCondition />,
  breadcrumb: (t) => t("editCondition"),
  handle: {
    access: "manage-clients",
  },
};

export const toEditClientPolicyCondition = (
  params: EditClientPolicyConditionParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(EditClientPolicyConditionRoute.path, params),
});
