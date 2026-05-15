// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type IdentityProviderSamlParams = { realm: string };
export const IdentityProviderSamlRoute = {
  path: "/:realm/identity-providers/saml/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderSaml = (
  params: IdentityProviderSamlParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderSamlRoute.path, params),
});
