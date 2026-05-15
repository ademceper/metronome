// @ts-nocheck
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { Path } from "react-router-dom";
export type UserTab = "list" | "permissions";

export type UsersParams = { realm: string; tab?: UserTab };
export const UsersRoute = {
  path: "/:realm/users",
  handle: {
    access: "query-users",
  },
};

export const UsersRouteWithTab = {
  ...UsersRoute,
  path: "/:realm/users/:tab",
};

export const toUsers = (params: UsersParams): Partial<Path> => {
  const path = params.tab ? UsersRouteWithTab.path : UsersRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
