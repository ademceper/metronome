/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/utils/createNamedContext.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { Context } from "react";
import { createContext } from "react";

export type NamedContext<T> = Context<T> &
  Required<Pick<Context<T>, "displayName">>;

export function createNamedContext<T>(displayName: string, defaultValue: T) {
  const context = createContext(defaultValue);
  context.displayName = displayName;
  return context as NamedContext<T>;
}
