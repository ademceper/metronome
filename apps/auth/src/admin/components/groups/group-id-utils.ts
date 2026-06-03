/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/groupIdUtils.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

export const getId = (pathname: string) => {
  const pathParts = pathname.substring(1).split("/");
  const spliceStart = pathParts[1] === "organizations" ? 4 : 2;
  return pathParts.length > 1 ? pathParts.splice(spliceStart) : undefined;
};

export const getLastId = (pathname: string) => {
  const pathParts = getId(pathname);
  return pathParts ? pathParts[pathParts.length - 1] : undefined;
};
