// @ts-nocheck
import { Path, generatePath } from "react-router-dom";
export type PageListParams = { realm?: string; providerId: string };
export type PageParams = { realm: string; providerId: string; id: string };
const PageListRoute = {
  path: "/:realm?/page-section/:providerId",
  handle: {
    access: "view-realm",
  },
};

const PageDetailRoute = {
  path: "/:realm/page-section/:providerId/:id",
  handle: {
    access: "view-realm",
  },
};

const AddPageDetailRoute = {
  path: "/:realm/page-section/:providerId/add",
  handle: {
    access: "view-realm",
  },
};

const routes = [
  PageDetailRoute,
  AddPageDetailRoute,
  PageListRoute,
];

export const toPage = (params: PageListParams): Partial<Path> => ({
  pathname: generatePath(PageListRoute.path, params),
});

export const toDetailPage = (params: PageParams): Partial<Path> => ({
  pathname: generatePath(PageDetailRoute.path, params),
});

export const addDetailPage = (params: Partial<PageParams>): Partial<Path> => ({
  pathname: generatePath(AddPageDetailRoute.path, params),
});

export default routes;
