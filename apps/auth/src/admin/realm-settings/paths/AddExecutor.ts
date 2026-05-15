// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type AddExecutorParams = {
  realm: string;
  profileName: string;
};
export const AddExecutorRoute = {
  path: "/:realm/realm-settings/client-policies/:profileName/add-executor",
  handle: {
    access: "manage-realm",
  },
};

export const toAddExecutor = (params: AddExecutorParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddExecutorRoute.path, params),
});
