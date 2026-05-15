// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type PermissionConfigurationDetailParams = {
  realm: string;
  id: string;
  permissionId: string;
  permissionType: string;
};
export const PermissionConfigurationDetailRoute = {
  path: "/:realm/clients/:id/permissions/permission/:permissionId/:permissionType",
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
  params: PermissionConfigurationDetailParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(
    PermissionConfigurationDetailRoute.path,
    params,
  ),
});
