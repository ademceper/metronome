/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/context/auth/uiRealmInfo.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

/** Information about a realm, which is available for all admins of the realm */
export interface UiRealmInfo {
  /** Whether at least one user storage provider is enabled */
  userProfileProvidersEnabled?: boolean;
}
