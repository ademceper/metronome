// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generate-encoded-path";

// ─── from organizations/paths/AddOrganization.ts ─────
export type AddOrganizationParams = { realm: string };
export const AddOrganizationRoute = {
  path: "/:realm/organizations/new",
  handle: {
    access: "manage-users",
  },
};

export const toAddOrganization = (
  params: AddOrganizationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(AddOrganizationRoute.path, params),
});

// ─── from organizations/paths/EditOrganization.ts ─────
export type OrganizationTab =
  | "settings"
  | "attributes"
  | "members"
  | "groups"
  | "identityProviders"
  | "events";

export type EditOrganizationParams = {
  realm: string;
  id: string;
  tab: OrganizationTab;
};
export const EditOrganizationRoute = {
  path: "/:realm/organizations/:id/:tab/*",
  handle: {
    access: "manage-users",
  },
};

export const toEditOrganization = (
  params: EditOrganizationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(EditOrganizationRoute.path, params),
});

// ─── from organizations/paths/Organizations.ts ─────
type OrganizationsRouteParams = {
  realm: string;
};
export const OrganizationsRoute = {
  path: "/:realm/organizations",
  handle: {
    access: "query-groups",
  },
};

export const toOrganizations = (
  params: OrganizationsRouteParams,
): Partial<Path> => {
  const path = OrganizationsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
