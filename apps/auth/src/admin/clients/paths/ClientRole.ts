// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ClientRoleTab =
  | "details"
  | "attributes"
  | "users-in-role"
  | "associated-roles";

export type ClientRoleParams = {
  realm: string;
  clientId: string;
  id: string;
  tab: ClientRoleTab;
};
export const ClientRoleRoute = {
  path: "/:realm/clients/:clientId/roles/:id/:tab" as const,
  handle: {
    access: "query-clients",
  },
};

export const toClientRole = (params: ClientRoleParams): Partial<Path> => ({
  pathname: generateEncodedPath(ClientRoleRoute.path, params),
});
