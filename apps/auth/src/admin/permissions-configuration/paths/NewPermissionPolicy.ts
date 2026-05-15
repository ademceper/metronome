// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewPermissionPolicyDetailsParams = {
  realm: string;
  permissionClientId: string;
  policyType: string;
};
export const NewPermissionPolicyRoute = {
  path: "/:realm/permissions/:permissionClientId/policies/new/:policyType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const toCreatePermissionPolicy = (
  params: NewPermissionPolicyDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewPermissionPolicyRoute.path, params),
});
