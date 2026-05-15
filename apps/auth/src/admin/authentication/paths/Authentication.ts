// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type AuthenticationTab = "flows" | "required-actions" | "policies";

export type AuthenticationParams = { realm: string; tab?: AuthenticationTab };
export const AuthenticationRoute = {
  path: "/:realm/authentication",
  handle: {
    access: ["view-realm", "view-identity-providers", "view-clients"],
  },
};

export const AuthenticationRouteWithTab = {
  ...AuthenticationRoute,
  path: "/:realm/authentication/:tab",
};

export const toAuthentication = (
  params: AuthenticationParams,
): Partial<Path> => {
  const path = params.tab
    ? AuthenticationRouteWithTab.path
    : AuthenticationRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
