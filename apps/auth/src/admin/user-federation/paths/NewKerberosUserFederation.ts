// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewKerberosUserFederationParams = { realm: string };
export const NewKerberosUserFederationRoute = {
  path: "/:realm/user-federation/kerberos/new",
  handle: {
    access: "view-realm",
  },
};

export const toNewKerberosUserFederation = (
  params: NewKerberosUserFederationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewKerberosUserFederationRoute.path, params),
});
