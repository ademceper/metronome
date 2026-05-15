// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
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
