/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/KeysTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type KeySubTab = "list" | "providers";

export type KeysParams = {
  realm: string;
  tab: KeySubTab;
};

const RealmSettingsSection = lazy(() => import("../RealmSettingsSection"));

export const KeysRoute: AppRouteObject = {
  path: "/:realm/realm-settings/keys/:tab",
  element: <RealmSettingsSection />,
  breadcrumb: (t) => t("keys"),
  handle: {
    access: "view-realm",
  },
};

export const toKeysTab = (params: KeysParams): Partial<Path> => ({
  pathname: generateEncodedPath(KeysRoute.path, params),
});
