// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generateEncodedPath";

// ─── from user-federation/paths/CustomUserFederation.ts ─────
export type CustomUserFederationRouteParams = {
  realm: string;
  providerId: string;
  id: string;
};
export const CustomUserFederationRoute = {
  path: "/:realm/user-federation/:providerId/:id",
  handle: {
    access: "view-realm",
  },
};

export const toCustomUserFederation = (
  params: CustomUserFederationRouteParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(CustomUserFederationRoute.path, params),
});

// ─── from user-federation/paths/NewCustomUserFederation.ts ─────
export type NewCustomUserFederationRouteParams = {
  realm: string;
  providerId: string;
};
export const NewCustomUserFederationRoute = {
  path: "/:realm/user-federation/:providerId/new",
  handle: {
    access: "view-realm",
  },
};

export const toNewCustomUserFederation = (
  params: NewCustomUserFederationRouteParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewCustomUserFederationRoute.path, params),
});

// ─── from user-federation/paths/NewKerberosUserFederation.ts ─────
export type NewKerberosUserFederationParams = { realm: string };
export const NewKerberosUserFederationRoute = {
  path: "/:realm/user-federation/kerberos/new",
  handle: {
    access: "view-realm",
  },
};

export const toNewKerberosUserFederation = (
  params: NewKerberosUserFederationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewKerberosUserFederationRoute.path, params),
});

// ─── from user-federation/paths/NewLdapUserFederation.ts ─────
export type NewLdapUserFederationParams = { realm: string };
export const NewLdapUserFederationRoute = {
  path: "/:realm/user-federation/ldap/new",
  breadcrumb: (t) => t("addProvider", { provider: "LDAP", count: 1 }),
  handle: {
    access: "view-realm",
  },
};

export const toNewLdapUserFederation = (
  params: NewLdapUserFederationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewLdapUserFederationRoute.path, params),
});

// ─── from user-federation/paths/UserFederation.ts ─────
export type UserFederationParams = { realm: string };
export const UserFederationRoute = {
  path: "/:realm/user-federation",
  handle: {
    access: "view-realm",
  },
};

export const toUserFederation = (
  params: UserFederationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationRoute.path, params),
});

// ─── from user-federation/paths/UserFederationKerberos.ts ─────
export type UserFederationKerberosParams = {
  realm: string;
  id: string;
};
export const UserFederationKerberosRoute = {
  path: "/:realm/user-federation/kerberos/:id",
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationKerberos = (
  params: UserFederationKerberosParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationKerberosRoute.path, params),
});

// ─── from user-federation/paths/UserFederationLdap.ts ─────
export type UserFederationLdapTab = "settings" | "mappers";

export type UserFederationLdapParams = {
  realm: string;
  id: string;
  tab?: UserFederationLdapTab;
};
export const UserFederationLdapRoute = {
  path: "/:realm/user-federation/ldap/:id",
  handle: {
    access: "view-realm",
  },
};

export const UserFederationLdapWithTabRoute = {
  ...UserFederationLdapRoute,
  path: "/:realm/user-federation/ldap/:id/:tab",
};

export const toUserFederationLdap = (
  params: UserFederationLdapParams,
): Partial<Path> => {
  const path = params.tab
    ? UserFederationLdapWithTabRoute.path
    : UserFederationLdapRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};

// ─── from user-federation/paths/UserFederationLdapMapper.ts ─────
export type UserFederationLdapMapperParams = {
  realm: string;
  id: string;
  mapperId: string;
};
export const UserFederationLdapMapperRoute = {
  path: "/:realm/user-federation/ldap/:id/mappers/:mapperId",
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationLdapMapper = (
  params: UserFederationLdapMapperParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationLdapMapperRoute.path, params),
});

// ─── from user-federation/paths/UserFederationsKerberos.ts ─────
export type UserFederationsKerberosParams = { realm: string };
export const UserFederationsKerberosRoute = {
  path: "/:realm/user-federation/kerberos",
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationsKerberos = (
  params: UserFederationsKerberosParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationsKerberosRoute.path, params),
});

// ─── from user-federation/paths/UserFederationsLdap.ts ─────
export type UserFederationsLdapParams = { realm: string };
export const UserFederationsLdapRoute = {
  path: "/:realm/user-federation/ldap",
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationsLdap = (
  params: UserFederationsLdapParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationsLdapRoute.path, params),
});
