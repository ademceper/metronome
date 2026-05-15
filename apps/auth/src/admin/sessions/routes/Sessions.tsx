/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/sessions/routes/Sessions.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type SessionsParams = { realm: string };

const SessionsSection = lazy(() => import("../SessionsSection"));

export const SessionsRoute: AppRouteObject = {
  path: "/:realm/sessions",
  element: <SessionsSection />,
  breadcrumb: (t) => t("titleSessions"),
  handle: {
    access: ["view-realm", "view-clients", "view-users"],
  },
};

export const toSessions = (params: SessionsParams): Partial<Path> => ({
  pathname: generateEncodedPath(SessionsRoute.path, params),
});
