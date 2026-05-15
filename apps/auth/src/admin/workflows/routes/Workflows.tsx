/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/workflows/routes/Workflows.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";

export type WorkflowsParams = { realm: string };

const WorkflowsSection = lazy(() => import("../WorkflowsSection"));

export const WorkflowsRoute: AppRouteObject = {
  path: "/:realm/workflows",
  element: <WorkflowsSection />,
  breadcrumb: (t) => t("workflows"),
  handle: {
    access: "manage-realm",
  },
};

export const toWorkflows = (params: WorkflowsParams): Partial<Path> => ({
  pathname: generateEncodedPath(WorkflowsRoute.path, params),
});
