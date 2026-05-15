// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type CreateFlowParams = { realm: string };
export const CreateFlowRoute = {
  path: "/:realm/authentication/flows/create",
  handle: {
    access: "manage-authorization",
  },
};

export const toCreateFlow = (params: CreateFlowParams): Partial<Path> => ({
  pathname: generateEncodedPath(CreateFlowRoute.path, params),
});
