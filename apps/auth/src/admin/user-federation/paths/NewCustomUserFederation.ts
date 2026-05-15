// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewCustomUserFederationRouteParams = {
  realm: string;
  providerId: string;
};
export const NewCustomUserFederationRoute = {
  path: "/:realm/user-federation/:providerId/new",
  handle: {
    access: "view-realm",
  },
};

export const toNewCustomUserFederation = (
  params: NewCustomUserFederationRouteParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewCustomUserFederationRoute.path, params),
});
