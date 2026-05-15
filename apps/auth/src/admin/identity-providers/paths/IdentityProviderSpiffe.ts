// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type IdentityProviderSpiffeParams = { realm: string };
export const IdentityProviderSpiffeRoute = {
  path: "/:realm/identity-providers/spiffe/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderSpiffe = (
  params: IdentityProviderSpiffeParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderSpiffeRoute.path, params),
});
