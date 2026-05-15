/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/routes.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { AppRouteObject } from "../route-utils";
import {
  AuthenticationRoute,
  AuthenticationRouteWithTab,
} from "./routes/Authentication";
import { CreateFlowRoute } from "./routes/CreateFlow";
import { FlowRoute, FlowWithBuiltInRoute } from "./routes/Flow";

const routes: AppRouteObject[] = [
  AuthenticationRoute,
  AuthenticationRouteWithTab,
  CreateFlowRoute,
  FlowRoute,
  FlowWithBuiltInRoute,
];

export default routes;
