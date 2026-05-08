/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/utils/isDefined.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}
