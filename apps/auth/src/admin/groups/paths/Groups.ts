// @ts-nocheck
import { generatePath, type Path } from "react-router-dom";
export type GroupsParams = {
  realm: string;
  id?: string;
  lazy?: string;
  orgId?: string;
};
export const GroupsRoute = {
  path: "/:realm/groups/*",
  handle: {
    access: "query-groups",
  },
};

export const OrgGroupsRoute = {
  path: "/:realm/organizations/:orgId/groups/*",
  handle: {
    access: "query-groups",
  },
};

export const GroupsWithIdRoute = {
  ...GroupsRoute,
  path: "/:realm/groups/:id",
};

export const OrgGroupsWithIdRoute = {
  ...OrgGroupsRoute,
  path: "/:realm/organizations/:orgId/groups/:id",
};

export const toGroups = (params: GroupsParams): Partial<Path> => {
  const routes = {
    orgGroups: params.id ? OrgGroupsWithIdRoute.path : OrgGroupsRoute.path,
    realmGroups: params.id ? GroupsWithIdRoute.path : GroupsRoute.path,
  };

  const path = params.orgId ? routes.orgGroups : routes.realmGroups;

  return {
    pathname: generatePath(path, params),
  };
};
