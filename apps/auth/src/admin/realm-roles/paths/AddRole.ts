// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type AddRoleParams = { realm: string };
export const AddRoleRoute = {
  path: "/:realm/roles/new",
  handle: {
    access: "manage-realm",
  },
};

export const toAddRole = (params: AddRoleParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddRoleRoute.path, params),
});
