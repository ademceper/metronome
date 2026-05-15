/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/workflows/routes.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { AppRouteObject } from "../route-utils";
import { WorkflowsRoute } from "./routes/Workflows";
import { WorkflowDetailRoute } from "./routes/WorkflowDetail";

const routes: AppRouteObject[] = [WorkflowsRoute, WorkflowDetailRoute];

export default routes;
