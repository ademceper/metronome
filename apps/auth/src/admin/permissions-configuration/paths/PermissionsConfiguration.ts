// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type PermissionsConfigurationParams = { realm: string };
export const PermissionsConfigurationRoute = {
  path: "/:realm/permissions",
  handle: {
    access: ["view-realm", "view-clients", "view-users"],
  },
};

export const toPermissionsConfiguration = (
  params: PermissionsConfigurationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionsConfigurationRoute.path, params),
});
