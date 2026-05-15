// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type CustomUserFederationRouteParams = {
  realm: string;
  providerId: string;
  id: string;
};
export const CustomUserFederationRoute = {
  path: "/:realm/user-federation/:providerId/:id",
  handle: {
    access: "view-realm",
  },
};

export const toCustomUserFederation = (
  params: CustomUserFederationRouteParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(CustomUserFederationRoute.path, params),
});
