/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/routes/UserProfile.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type UserProfileTab =
  | "attributes"
  | "attributes-group"
  | "unmanaged-attributes"
  | "json-editor";

export type UserProfileParams = {
  realm: string;
  tab: UserProfileTab;
};

const RealmSettingsSection = lazy(() => import("../RealmSettingsSection"));

export const UserProfileRoute: AppRouteObject = {
  path: "/:realm/realm-settings/user-profile/:tab",
  element: <RealmSettingsSection />,
  breadcrumb: (t) => t("userProfile"),
  handle: {
    access: "view-realm",
  },
};

export const toUserProfile = (params: UserProfileParams): Partial<Path> => ({
  pathname: generateEncodedPath(UserProfileRoute.path, params),
});
