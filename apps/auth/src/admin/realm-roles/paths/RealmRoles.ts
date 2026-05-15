// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type RealmRolesParams = { realm: string };
export const RealmRolesRoute = {
  path: "/:realm/roles",
  handle: {
    access: "view-realm",
  },
};

export const toRealmRoles = (params: RealmRolesParams): Partial<Path> => ({
  pathname: generateEncodedPath(RealmRolesRoute.path, params),
});
