// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type AddUserParams = { realm: string };
export const AddUserRoute = {
  path: "/:realm/users/add-user",
  handle: {
    access: ["query-users", "query-groups"],
  },
};

export const toAddUser = (params: AddUserParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddUserRoute.path, params),
});
