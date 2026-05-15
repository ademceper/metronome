/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm/RealmRoutes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generateEncodedPath";
import type { AppRouteObject } from "../route-utils";

export type RealmParams = { realm: string };

const RealmSection = lazy(() => import("./RealmSection"));

export const RealmRoute: AppRouteObject = {
  path: "/:realm/realms",
  element: <RealmSection />,
  breadcrumb: (t) => t("realms"),
  handle: {
    access: "anyone",
  },
};

export const toRealm = (params: RealmParams): Partial<Path> => ({
  pathname: generateEncodedPath(RealmRoute.path, params),
});
