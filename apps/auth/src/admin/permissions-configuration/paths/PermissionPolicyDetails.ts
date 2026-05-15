// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type PermissionPolicyDetailsParams = {
  realm: string;
  permissionClientId: string;
  policyId: string;
  policyType: string;
};
export const PermissionPolicyDetailsRoute = {
  path: "/:realm/permissions/:permissionClientId/policies/:policyId/:policyType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const toPermissionPolicyDetails = (
  params: PermissionPolicyDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionPolicyDetailsRoute.path, params),
});
