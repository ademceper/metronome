// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type IdentityProviderAddMapperParams = {
  realm: string;
  providerId: string;
  alias: string;
  tab: string;
};
export const IdentityProviderAddMapperRoute = {
  path: "/:realm/identity-providers/:providerId/:alias/:tab/create",
  handle: {
    access: "manage-identity-providers",
  },
};

export const toIdentityProviderAddMapper = (
  params: IdentityProviderAddMapperParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderAddMapperRoute.path, params),
});
