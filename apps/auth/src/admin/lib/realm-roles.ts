// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generateEncodedPath";

// ─── from realm-roles/paths/AddRole.ts ─────
export type AddRoleParams = { realm: string };
export const AddRoleRoute = {
  path: "/:realm/roles/new",
  handle: {
    access: "manage-realm",
  },
};

export const toAddRole = (params: AddRoleParams): Partial<Path> => ({
  pathname: generateEncodedPath(AddRoleRoute.path, params),
});

// ─── from realm-roles/paths/RealmRole.ts ─────
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

// ─── from realm-roles/paths/RealmRoles.ts ─────
export type RealmRolesParams = { realm: string };
export const RealmRolesRoute = {
  path: "/:realm/roles",
  handle: {
    access: "view-realm",
  },
};

export const toRealmRoles = (params: RealmRolesParams): Partial<Path> => ({
  pathname: generateEncodedPath(RealmRolesRoute.path, params),
});
