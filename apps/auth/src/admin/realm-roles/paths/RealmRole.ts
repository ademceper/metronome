// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type RealmRoleTab =
  | "details"
  | "associated-roles"
  | "attributes"
  | "users-in-role"
  | "permissions"
  | "events";

export type RealmRoleParams = {
  realm: string;
  id: string;
  tab: RealmRoleTab;
};
export const RealmRoleRoute = {
  path: "/:realm/roles/:id/:tab",
  handle: {
    access: ["view-realm", "view-users"],
  },
};

export const toRealmRole = (params: RealmRoleParams): Partial<Path> => ({
  pathname: generateEncodedPath(RealmRoleRoute.path, params),
});
