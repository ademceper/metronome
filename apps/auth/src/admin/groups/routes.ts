/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/routes.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { AppRouteObject } from "../route-utils";
import { GroupsRoute, GroupsWithIdRoute } from "./routes/Groups";

const routes: AppRouteObject[] = [GroupsRoute, GroupsWithIdRoute];

export default routes;
