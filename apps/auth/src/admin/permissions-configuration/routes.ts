/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/routes.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { AppRouteObject } from "../routes";
import { NewPermissionConfigurationRoute } from "./routes/NewPermissionConfiguration";
import { NewPermissionPolicyRoute } from "./routes/NewPermissionPolicy";
import { PermissionConfigurationDetailRoute } from "./routes/PermissionConfigurationDetails";
import { PermissionPolicyDetailsRoute } from "./routes/PermissionPolicyDetails";
import { PermissionsConfigurationRoute } from "./routes/PermissionsConfiguration";
import { PermissionsConfigurationTabsRoute } from "./routes/PermissionsConfigurationTabs";
import { PermissionsPoliciesRoute } from "./routes/PermissionsPolicies";

const routes: AppRouteObject[] = [
  NewPermissionConfigurationRoute,
  PermissionConfigurationDetailRoute,
  PermissionsConfigurationRoute,
  PermissionsConfigurationTabsRoute,
  PermissionsPoliciesRoute,
  NewPermissionPolicyRoute,
  PermissionPolicyDetailsRoute,
];

export default routes;
