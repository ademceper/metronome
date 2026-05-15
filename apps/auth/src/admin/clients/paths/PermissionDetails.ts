// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { PermissionType } from "./NewPermission";

export type PermissionDetailsParams = {
  realm: string;
  id: string;
  permissionType: string | PermissionType;
  permissionId: string;
};
export const PermissionDetailsRoute = {
  path: "/:realm/clients/:id/authorization/permission/:permissionType/:permissionId",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const toPermissionDetails = (
  params: PermissionDetailsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionDetailsRoute.path, params),
});
