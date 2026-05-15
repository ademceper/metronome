/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/ClientPolicies.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type ClientPoliciesTab = "profiles" | "policies";

export type ClientPoliciesParams = {
  realm: string;
  tab: ClientPoliciesTab;
};

const RealmSettingsSection = lazy(() => import("../RealmSettingsSection"));

export const ClientPoliciesRoute: AppRouteObject = {
  path: "/:realm/realm-settings/client-policies/:tab",
  element: <RealmSettingsSection />,
  breadcrumb: (t) => t("clientPolicies"),
  handle: {
    access: "view-realm",
  },
};

export const toClientPolicies = (
  params: ClientPoliciesParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(ClientPoliciesRoute.path, params),
});
