// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type IdentityProviderEditMapperParams = {
  realm: string;
  providerId: string;
  alias: string;
  id: string;
};
export const IdentityProviderEditMapperRoute = {
  path: "/:realm/identity-providers/:providerId/:alias/mappers/:id",
  handle: {
    access: "view-identity-providers",
  },
};

export const toIdentityProviderEditMapper = (
  params: IdentityProviderEditMapperParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderEditMapperRoute.path, params),
});
