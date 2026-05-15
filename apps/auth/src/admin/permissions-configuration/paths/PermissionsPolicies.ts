// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type PermissionsPoliciesParams = {
  realm: string;
  permissionClientId: string;
};
export const PermissionsPoliciesRoute = {
  path: "/:realm/permissions/:permissionClientId/policies",
  handle: {
    access: ["view-realm", "view-clients", "view-users"],
  },
};

export const toPermissionsPolicies = (
  params: PermissionsPoliciesParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionsPoliciesRoute.path, params),
});
