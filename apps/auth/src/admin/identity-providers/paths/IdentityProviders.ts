// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type IdentityProvidersParams = { realm: string };
export const IdentityProvidersRoute = {
  path: "/:realm/identity-providers",
  handle: {
    access: "view-identity-providers",
  },
};

export const toIdentityProviders = (
  params: IdentityProvidersParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProvidersRoute.path, params),
});
