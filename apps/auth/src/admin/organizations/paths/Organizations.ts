// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";

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
