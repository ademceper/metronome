// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type PermissionType = "resource" | "scope";

export type NewPermissionParams = {
  realm: string;
  id: string;
  permissionType: PermissionType;
  selectedId?: string;
};
export const NewPermissionRoute = {
  path: "/:realm/clients/:id/authorization/permission/new/:permissionType",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("manage-clients", "manage-authorization"),
  },
};

export const NewPermissionWithSelectedIdRoute = {
  ...NewPermissionRoute,
  path: "/:realm/clients/:id/authorization/permission/new/:permissionType/:selectedId",
};

export const toNewPermission = (params: NewPermissionParams): Partial<Path> => {
  const path = params.selectedId
    ? NewPermissionWithSelectedIdRoute.path
    : NewPermissionRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
