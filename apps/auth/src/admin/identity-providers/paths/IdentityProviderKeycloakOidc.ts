// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type IdentityProviderKeycloakOidcParams = { realm: string };
export const IdentityProviderKeycloakOidcRoute = {
  path: "/:realm/identity-providers/keycloak-oidc/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderKeycloakOidc = (
  params: IdentityProviderKeycloakOidcParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderKeycloakOidcRoute.path, params),
});
