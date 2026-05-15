// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ClientsTab =
  | "list"
  | "initial-access-token"
  | "client-registration";

export type ClientsParams = {
  realm: string;
  tab?: ClientsTab;
};
export const ClientsRoute = {
  path: "/:realm/clients",
  handle: {
    access: "query-clients",
  },
};

export const ClientsRouteWithTab = {
  ...ClientsRoute,
  path: "/:realm/clients/:tab",
};

export const toClients = (params: ClientsParams): Partial<Path> => {
  const path = params.tab ? ClientsRouteWithTab.path : ClientsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
