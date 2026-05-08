/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/utils/getAuthorizationHeaders.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

export function getAuthorizationHeaders(
  accessToken?: string,
): Record<string, string> {
  if (!accessToken) {
    return {};
  }

  return { Authorization: `Bearer ${accessToken}` };
}
