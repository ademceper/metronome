// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewScopeParams = { realm: string; id: string };
export const NewScopeRoute = {
  path: "/:realm/clients/:id/authorization/scope/new",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const toNewScope = (params: NewScopeParams): Partial<Path> => ({
  pathname: generateEncodedPath(NewScopeRoute.path, params),
});
