// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type PermissionsConfigurationTabs =
  | "permissions"
  | "policies"
  | "evaluation";

export type PermissionsConfigurationTabsParams = {
  realm: string;
  permissionClientId: string;
  tab: PermissionsConfigurationTabs;
};
export const PermissionsConfigurationTabsRoute = {
  path: "/:realm/permissions/:permissionClientId/:tab",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny("view-realm", "view-clients", "view-users"),
  },
};

export const toPermissionsConfigurationTabs = (
  params: PermissionsConfigurationTabsParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(PermissionsConfigurationTabsRoute.path, params),
});
