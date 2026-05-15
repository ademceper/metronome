// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewRoleParams = { realm: string; clientId: string };
export const NewRoleRoute = {
  path: "/:realm/clients/:clientId/roles/new",
  handle: {
    access: "query-clients",
  },
};

export const toCreateRole = (params: NewRoleParams): Partial<Path> => ({
  pathname: generateEncodedPath(NewRoleRoute.path, params),
});
