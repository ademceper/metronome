/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/utils/joinPath.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

const PATH_SEPARATOR = "/";

export function joinPath(...paths: string[]) {
  const normalizedPaths = paths.map((path, index) => {
    const isFirst = index === 0;
    const isLast = index === paths.length - 1;

    // Strip out any leading slashes from the path.
    if (!isFirst && path.startsWith(PATH_SEPARATOR)) {
      path = path.slice(1);
    }

    // Strip out any trailing slashes from the path.
    if (!isLast && path.endsWith(PATH_SEPARATOR)) {
      path = path.slice(0, -1);
    }

    return path;
  }, []);

  return normalizedPaths.join(PATH_SEPARATOR);
}
