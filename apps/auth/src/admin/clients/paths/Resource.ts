// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ResourceDetailsParams = {
  realm: string;
  id: string;
  resourceId?: string;
};
export const ResourceDetailsRoute = {
  path: "/:realm/clients/:id/authorization/resource",
  handle: {
    access: (accessChecker) =>
      accessChecker.hasAny(
        "manage-clients",
        "view-authorization",
        "manage-authorization",
      ),
  },
};

export const ResourceDetailsWithResourceIdRoute = {
  ...ResourceDetailsRoute,
  path: "/:realm/clients/:id/authorization/resource/:resourceId",
};

export const toResourceDetails = (
  params: ResourceDetailsParams,
): Partial<Path> => {
  const path = params.resourceId
    ? ResourceDetailsWithResourceIdRoute.path
    : ResourceDetailsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
