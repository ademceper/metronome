// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generate-encoded-path";

// ─── from dashboard/paths/Dashboard.ts ─────
export type DashboardTab = "info" | "providers" | "welcome";

export type DashboardParams = { realm?: string; tab?: DashboardTab };
export const DashboardRoute = {
  path: "/",
  handle: {
    access: "anyone",
  },
};

export const DashboardRouteWithRealm = {
  ...DashboardRoute,
  path: "/:realm",
};

export const DashboardRouteWithTab = {
  ...DashboardRoute,
  path: "/:realm/:tab",
};

export const toDashboard = (params: DashboardParams): Partial<Path> => {
  const pathname = params.realm
    ? params.tab
      ? DashboardRouteWithTab.path
      : DashboardRouteWithRealm.path
    : DashboardRoute.path;

  return {
    pathname: generateEncodedPath(pathname, params),
  };
};
