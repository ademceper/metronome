// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
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
