// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type IdentityProviderKubernetesParams = { realm: string };
export const IdentityProviderKubernetesRoute = {
  path: "/:realm/identity-providers/kubernetes/add",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderKubernetes = (
  params: IdentityProviderKubernetesParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderKubernetesRoute.path, params),
});
