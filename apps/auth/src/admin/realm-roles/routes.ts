/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-roles/routes.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { AppRouteObject } from "../route-utils";
import { AddRoleRoute } from "./routes/AddRole";
import { RealmRoleRoute } from "./routes/RealmRole";
import { RealmRolesRoute } from "./routes/RealmRoles";

const routes: AppRouteObject[] = [
  RealmRolesRoute,
  AddRoleRoute,
  RealmRoleRoute,
];

export default routes;
