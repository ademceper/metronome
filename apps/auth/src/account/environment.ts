/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/environment.ts" --revert
 */

import { getInjectedEnvironment } from "../shared/keycloak-ui-shared";
import { type AccountEnvironment } from ".";

export const environment = getInjectedEnvironment<AccountEnvironment>();
