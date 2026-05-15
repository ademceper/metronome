// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewLdapUserFederationParams = { realm: string };
export const NewLdapUserFederationRoute = {
  path: "/:realm/user-federation/ldap/new",
  breadcrumb: (t) => t("addProvider", { provider: "LDAP", count: 1 }),
  handle: {
    access: "view-realm",
  },
};

export const toNewLdapUserFederation = (
  params: NewLdapUserFederationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewLdapUserFederationRoute.path, params),
});
