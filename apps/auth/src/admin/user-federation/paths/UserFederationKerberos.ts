// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type UserFederationKerberosParams = {
  realm: string;
  id: string;
};
export const UserFederationKerberosRoute = {
  path: "/:realm/user-federation/kerberos/:id",
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationKerberos = (
  params: UserFederationKerberosParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationKerberosRoute.path, params),
});
