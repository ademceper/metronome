// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";

export type DedicatedScopeTab = "mappers" | "scope";

export type DedicatedScopeDetailsParams = {
  realm: string;
  clientId: string;
  tab?: DedicatedScopeTab;
};
export const DedicatedScopeDetailsRoute = {
  path: "/:realm/clients/:clientId/clientScopes/dedicated",
  handle: {
    access: "view-clients",
  },
};

export const DedicatedScopeDetailsWithTabRoute = {
  ...DedicatedScopeDetailsRoute,
  path: "/:realm/clients/:clientId/clientScopes/dedicated/:tab",
};

export const toDedicatedScope = (
  params: DedicatedScopeDetailsParams,
): Partial<Path> => {
  const path = params.tab
    ? DedicatedScopeDetailsWithTabRoute.path
    : DedicatedScopeDetailsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
