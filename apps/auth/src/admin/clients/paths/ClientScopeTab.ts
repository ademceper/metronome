// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ClientScopesTab = "setup" | "evaluate";

export type ClientScopesParams = {
  realm: string;
  clientId: string;
  tab: ClientScopesTab;
};
export const ClientScopesRoute = {
  path: "/:realm/clients/:clientId/clientScopes/:tab",
  handle: {
    access: "view-clients",
  },
};

export const toClientScopesTab = (
  params: ClientScopesParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(ClientScopesRoute.path, params),
});
