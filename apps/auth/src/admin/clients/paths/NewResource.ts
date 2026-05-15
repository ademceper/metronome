// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewResourceParams = { realm: string; id: string };
export const NewResourceRoute = {
  path: "/:realm/clients/:id/authorization/resource/new",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const toCreateResource = (params: NewResourceParams): Partial<Path> => ({
  pathname: generateEncodedPath(NewResourceRoute.path, params),
});
