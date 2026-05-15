// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type IdentityProviderJWTAuthorizationGrantParams = { realm: string };
export const IdentityProviderJWTAuthorizationGrantRoute = {
  path: "/:realm/identity-providers/jwt-authorization-grant/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderJWTAuthorizationGrant = (
  params: IdentityProviderJWTAuthorizationGrantParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(
    IdentityProviderJWTAuthorizationGrantRoute.path,
    params,
  ),
});
