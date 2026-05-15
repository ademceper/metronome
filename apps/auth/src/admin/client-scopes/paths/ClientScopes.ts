// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ClientScopesParams = { realm: string };
export const ClientScopesRoute = {
  path: "/:realm/client-scopes",
  handle: {
    access: "view-clients",
  },
};

export const toClientScopes = (params: ClientScopesParams): Partial<Path> => ({
  pathname: generateEncodedPath(ClientScopesRoute.path, params),
});
