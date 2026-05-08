/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/Root.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { KeycloakProvider } from "../shared/keycloak-ui-shared";

import { App } from "./App";
import { environment } from "./environment";

export const Root = () => (
  <KeycloakProvider environment={environment}>
    <App />
  </KeycloakProvider>
);
