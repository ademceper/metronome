// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ExecutorParams = {
  realm: string;
  profileName: string;
  executorName: string;
};
export const ExecutorRoute = {
  path: "/:realm/realm-settings/client-policies/:profileName/edit-profile/:executorName",
  handle: {
    access: ["manage-realm"],
  },
};

export const toExecutor = (params: ExecutorParams): Partial<Path> => ({
  pathname: generateEncodedPath(ExecutorRoute.path, params),
});
