// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ClientTab =
  | "settings"
  | "keys"
  | "credentials"
  | "roles"
  | "clientScopes"
  | "advanced"
  | "mappers"
  | "authorization"
  | "serviceAccount"
  | "permissions"
  | "sessions"
  | "events";

export type ClientParams = {
  realm: string;
  clientId: string;
  tab: ClientTab;
};
export const ClientRoute = {
  path: "/:realm/clients/:clientId/:tab",
  handle: {
    access: "query-clients",
  },
};

export const toClient = (params: ClientParams): Partial<Path> => ({
  pathname: generateEncodedPath(ClientRoute.path, params),
});
