// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generateEncodedPath";

// ─── from identity-providers/paths/AddMapper.ts ─────
export type IdentityProviderAddMapperParams = {
  realm: string;
  providerId: string;
  alias: string;
  tab: string;
};
export const IdentityProviderAddMapperRoute = {
  path: "/:realm/identity-providers/:providerId/:alias/:tab/create",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderAddMapper = (
  params: IdentityProviderAddMapperParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderAddMapperRoute.path, params),
});

// ─── from identity-providers/paths/EditMapper.ts ─────
export type IdentityProviderEditMapperParams = {
  realm: string;
  providerId: string;
  alias: string;
  id: string;
};
export const IdentityProviderEditMapperRoute = {
  path: "/:realm/identity-providers/:providerId/:alias/mappers/:id",
  handle: {
    access: "view-identity-providers",
  },
};

export const toIdentityProviderEditMapper = (
  params: IdentityProviderEditMapperParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderEditMapperRoute.path, params),
});

// ─── from identity-providers/paths/IdentityProvider.ts ─────
export type IdentityProviderTab =
  | "settings"
  | "mappers"
  | "permissions"
  | "events";

export type IdentityProviderParams = {
  realm: string;
  providerId: string;
  alias: string;
  tab: IdentityProviderTab;
};
export const IdentityProviderRoute = {
  path: "/:realm/identity-providers/:providerId/:alias/:tab",
  handle: {
    access: "view-identity-providers",
  },
};

export const toIdentityProvider = (
  params: IdentityProviderParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderRoute.path, params),
});

// ─── from identity-providers/paths/IdentityProviderCreate.ts ─────
export type IdentityProviderCreateParams = {
  realm: string;
  providerId: string;
};
export const IdentityProviderCreateRoute = {
  path: "/:realm/identity-providers/:providerId/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderCreate = (
  params: IdentityProviderCreateParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderCreateRoute.path, params),
});

// ─── from identity-providers/paths/IdentityProviderJWTAuthorizationGrant.ts ─────
export type IdentityProviderJWTAuthorizationGrantParams = { realm: string };
export const IdentityProviderJWTAuthorizationGrantRoute = {
  path: "/:realm/identity-providers/jwt-authorization-grant/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderJWTAuthorizationGrant = (
  params: IdentityProviderJWTAuthorizationGrantParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(
    IdentityProviderJWTAuthorizationGrantRoute.path,
    params,
  ),
});

// ─── from identity-providers/paths/IdentityProviderKeycloakOidc.ts ─────
export type IdentityProviderKeycloakOidcParams = { realm: string };
export const IdentityProviderKeycloakOidcRoute = {
  path: "/:realm/identity-providers/keycloak-oidc/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderKeycloakOidc = (
  params: IdentityProviderKeycloakOidcParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderKeycloakOidcRoute.path, params),
});

// ─── from identity-providers/paths/IdentityProviderKubernetes.ts ─────
export type IdentityProviderKubernetesParams = { realm: string };
export const IdentityProviderKubernetesRoute = {
  path: "/:realm/identity-providers/kubernetes/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderKubernetes = (
  params: IdentityProviderKubernetesParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderKubernetesRoute.path, params),
});

// ─── from identity-providers/paths/IdentityProviderOAuth2.ts ─────
export const IdentityProviderOAuth2Route = {
  path: "/:realm/identity-providers/oauth2/add",
  handle: {
    access: "manage-identity-providers",
  },
};

// ─── from identity-providers/paths/IdentityProviderOidc.ts ─────
export type IdentityProviderOidcParams = { realm: string };
export const IdentityProviderOidcRoute = {
  path: "/:realm/identity-providers/oidc/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderOidc = (
  params: IdentityProviderOidcParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderOidcRoute.path, params),
});

// ─── from identity-providers/paths/IdentityProviderSaml.ts ─────
export type IdentityProviderSamlParams = { realm: string };
export const IdentityProviderSamlRoute = {
  path: "/:realm/identity-providers/saml/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderSaml = (
  params: IdentityProviderSamlParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderSamlRoute.path, params),
});

// ─── from identity-providers/paths/IdentityProviderSpiffe.ts ─────
export type IdentityProviderSpiffeParams = { realm: string };
export const IdentityProviderSpiffeRoute = {
  path: "/:realm/identity-providers/spiffe/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderSpiffe = (
  params: IdentityProviderSpiffeParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderSpiffeRoute.path, params),
});

// ─── from identity-providers/paths/IdentityProviders.ts ─────
export type IdentityProvidersParams = { realm: string };
export const IdentityProvidersRoute = {
  path: "/:realm/identity-providers",
  handle: {
    access: "view-identity-providers",
  },
};

export const toIdentityProviders = (
  params: IdentityProvidersParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProvidersRoute.path, params),
});
