// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type AuthorizationTab =
  | "settings"
  | "resources"
  | "scopes"
  | "policies"
  | "permissions"
  | "evaluate"
  | "export";

export type AuthorizationParams = {
  realm: string;
  clientId: string;
  tab: AuthorizationTab;
};
export const AuthorizationRoute = {
  path: "/:realm/clients/:clientId/authorization/:tab",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("view-authorization", "manage-authorization"),
  },
};

export const toAuthorizationTab = (
  params: AuthorizationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(AuthorizationRoute.path, params),
});
