// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type PermissionConfigurationDetailsParams = {
  realm: string;
  permissionClientId: string;
  permissionId: string;
  resourceType: string;
};
export const PermissionConfigurationDetailRoute = {
  path: "/:realm/permissions/:permissionClientId/permission/:permissionId/:resourceType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const toPermissionConfigurationDetails = (
  params: PermissionConfigurationDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(
    PermissionConfigurationDetailRoute.path,
    params,
  ),
});
