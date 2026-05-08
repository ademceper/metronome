/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/routes/Flow.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type FlowParams = {
  realm: string;
  id: string;
  usedBy: string;
  builtIn?: string;
};

const FlowDetails = lazy(() => import("../FlowDetails"));

export const FlowRoute: AppRouteObject = {
  path: "/:realm/authentication/:id/:usedBy",
  element: <FlowDetails />,
  breadcrumb: (t) => t("flowDetails"),
  handle: {
    access: "view-authorization",
  },
};

export const FlowWithBuiltInRoute: AppRouteObject = {
  ...FlowRoute,
  path: "/:realm/authentication/:id/:usedBy/:builtIn",
};

export const toFlow = (params: FlowParams): Partial<Path> => {
  const path = params.builtIn ? FlowWithBuiltInRoute.path : FlowRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
