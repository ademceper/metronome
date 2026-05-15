// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type IdentityProviderTab =
  | "settings"
  | "mappers"
  | "permissions"
  | "events";

export type IdentityProviderParams = {
  realm: string;
  providerId: string;
  alias: string;
  tab: IdentityProviderTab;
};
export const IdentityProviderRoute = {
  path: "/:realm/identity-providers/:providerId/:alias/:tab",
  handle: {
    access: "view-identity-providers",
  },
};

export const toIdentityProvider = (
  params: IdentityProviderParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(IdentityProviderRoute.path, params),
});
