// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
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
