// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type IdentityProviderCreateParams = {
  realm: string;
  providerId: string;
};
export const IdentityProviderCreateRoute = {
  path: "/:realm/identity-providers/:providerId/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderCreate = (
  params: IdentityProviderCreateParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderCreateRoute.path, params),
});
