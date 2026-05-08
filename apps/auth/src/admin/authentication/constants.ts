/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/constants.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import AuthenticationFlowRepresentation from "@keycloak/keycloak-admin-client/lib/defs/authenticationFlowRepresentation";
import RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";

type UsedBy = "SPECIFIC_CLIENTS" | "SPECIFIC_PROVIDERS" | "DEFAULT";

export type AuthenticationType = AuthenticationFlowRepresentation & {
  usedBy?: { type?: UsedBy; values: string[] };
  realm: RealmRepresentation;
};

export const REALM_FLOWS = new Map<string, string>([
  ["browserFlow", "browser"],
  ["registrationFlow", "registration"],
  ["directGrantFlow", "direct grant"],
  ["resetCredentialsFlow", "reset credentials"],
  ["clientAuthenticationFlow", "clients"],
  ["dockerAuthenticationFlow", "docker auth"],
  ["firstBrokerLoginFlow", "firstBrokerLogin"],
]);
