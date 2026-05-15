// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewClientScopeParams = { realm: string };
export const NewClientScopeRoute = {
  path: "/:realm/client-scopes/new",
  handle: {
    access: "manage-clients",
  },
};

export const toNewClientScope = (
  params: NewClientScopeParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewClientScopeRoute.path, params),
});
