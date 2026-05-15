// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ClientScopeTab = "settings" | "mappers" | "scope" | "events";

export type ClientScopeParams = {
  realm: string;
  id: string;
  tab: ClientScopeTab;
};
export const ClientScopeRoute = {
  path: "/:realm/client-scopes/:id/:tab",
  handle: {
    access: "view-clients",
  },
};

export const toClientScope = (params: ClientScopeParams): Partial<Path> => {
  const path = ClientScopeRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
