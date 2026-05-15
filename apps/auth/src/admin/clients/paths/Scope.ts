// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ScopeDetailsParams = {
  realm: string;
  id: string;
  scopeId?: string;
};
export const ScopeDetailsRoute = {
  path: "/:realm/clients/:id/authorization/scope",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "view-authorization"),
  },
};

export const ScopeDetailsWithScopeIdRoute = {
  ...ScopeDetailsRoute,
  path: "/:realm/clients/:id/authorization/scope/:scopeId",
};

export const toScopeDetails = (params: ScopeDetailsParams): Partial<Path> => {
  const path = params.scopeId
    ? ScopeDetailsWithScopeIdRoute.path
    : ScopeDetailsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
