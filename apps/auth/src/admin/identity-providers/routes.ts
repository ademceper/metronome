/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/routes.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { AppRouteObject } from "../route-utils";
import { IdentityProviderRoute } from "./routes/IdentityProvider";
import { IdentityProviderKeycloakOidcRoute } from "./routes/IdentityProviderKeycloakOidc";
import { IdentityProviderOidcRoute } from "./routes/IdentityProviderOidc";
import { IdentityProviderSamlRoute } from "./routes/IdentityProviderSaml";
import { IdentityProviderSpiffeRoute } from "./routes/IdentityProviderSpiffe";
import { IdentityProviderKubernetesRoute } from "./routes/IdentityProviderKubernetes";
import { IdentityProvidersRoute } from "./routes/IdentityProviders";
import { IdentityProviderAddMapperRoute } from "./routes/AddMapper";
import { IdentityProviderEditMapperRoute } from "./routes/EditMapper";
import { IdentityProviderCreateRoute } from "./routes/IdentityProviderCreate";
import { IdentityProviderOAuth2Route } from "./routes/IdentityProviderOAuth2";
import { IdentityProviderJWTAuthorizationGrantRoute } from "./routes/IdentityProviderJWTAuthorizationGrant";

const routes: AppRouteObject[] = [
  IdentityProviderAddMapperRoute,
  IdentityProviderEditMapperRoute,
  IdentityProvidersRoute,
  IdentityProviderOidcRoute,
  IdentityProviderSamlRoute,
  IdentityProviderSpiffeRoute,
  IdentityProviderJWTAuthorizationGrantRoute,
  IdentityProviderKubernetesRoute,
  IdentityProviderKeycloakOidcRoute,
  IdentityProviderCreateRoute,
  IdentityProviderRoute,
  IdentityProviderOAuth2Route,
];

export default routes;
