// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type UserFederationLdapMapperParams = {
  realm: string;
  id: string;
  mapperId: string;
};
export const UserFederationLdapMapperRoute = {
  path: "/:realm/user-federation/ldap/:id/mappers/:mapperId",
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationLdapMapper = (
  params: UserFederationLdapMapperParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationLdapMapperRoute.path, params),
});
