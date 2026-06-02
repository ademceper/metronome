// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generate-encoded-path";

// ─── from user/paths/AddUser.ts ─────
export type AddUserParams = { realm: string };
export const AddUserRoute = {
  path: "/:realm/users/add-user",
  handle: {
    access: ["query-users", "query-groups"],
  },
};

export const toAddUser = (params: AddUserParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddUserRoute.path, params),
});

// ─── from user/paths/User.ts ─────
export type UserTab =
  | "settings"
  | "groups"
  | "organizations"
  | "consents"
  | "attributes"
  | "sessions"
  | "credentials"
  | "role-mapping"
  | "identity-provider-links"
  | "events"
  | "workflows";

export type UserParams = {
  realm: string;
  id: string;
  tab: UserTab;
};
export const UserRoute = {
  path: "/:realm/users/:id/:tab",
  handle: {
    access: "query-users",
  },
};

export const toUser = (params: UserParams): Partial<Path> => ({
  pathname: generateEncodedPath(UserRoute.path, params),
});

// ─── from user/paths/Users.ts ─────
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
