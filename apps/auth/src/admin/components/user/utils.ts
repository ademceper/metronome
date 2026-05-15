/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/utils.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

export const isLightweightUser = (userId?: string) =>
  userId?.startsWith("lightweight-");
