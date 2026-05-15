// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type IdentityProviderOidcParams = { realm: string };
export const IdentityProviderOidcRoute = {
  path: "/:realm/identity-providers/oidc/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderOidc = (
  params: IdentityProviderOidcParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderOidcRoute.path, params),
});
