// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type UserFederationsLdapParams = { realm: string };
export const UserFederationsLdapRoute = {
  path: "/:realm/user-federation/ldap",
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationsLdap = (
  params: UserFederationsLdapParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationsLdapRoute.path, params),
});
