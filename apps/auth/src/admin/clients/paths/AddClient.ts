// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type AddClientParams = { realm: string };
export const AddClientRoute = {
  path: "/:realm/clients/add-client",
  handle: {
    access: "manage-clients",
  },
};

export const toAddClient = (params: AddClientParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddClientRoute.path, params),
});
