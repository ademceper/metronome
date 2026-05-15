// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type NewPermissionConfigurationParams = {
  realm: string;
  permissionClientId: string;
  resourceType: string;
};
export const NewPermissionConfigurationRoute = {
  path: "/:realm/permissions/:permissionClientId/permission/new/:resourceType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const toCreatePermissionConfiguration = (
  params: NewPermissionConfigurationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(NewPermissionConfigurationRoute.path, params),
});
