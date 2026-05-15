// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type UserFederationParams = { realm: string };
export const UserFederationRoute = {
  path: "/:realm/user-federation",
  handle: {
    access: "view-realm",
  },
};

export const toUserFederation = (
  params: UserFederationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationRoute.path, params),
});
