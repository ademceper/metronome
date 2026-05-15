// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type UserFederationsKerberosParams = { realm: string };
export const UserFederationsKerberosRoute = {
  path: "/:realm/user-federation/kerberos",
  handle: {
    access: "view-realm",
  },
};

export const toUserFederationsKerberos = (
  params: UserFederationsKerberosParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(UserFederationsKerberosRoute.path, params),
});
