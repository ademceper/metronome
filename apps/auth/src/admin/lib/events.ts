// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generateEncodedPath";

// ─── from events/paths/Events.ts ─────
export type EventsTab = "user-events" | "admin-events";

export type EventsParams = {
  realm: string;
  tab?: EventsTab;
};
export const EventsRoute = {
  path: "/:realm/events",
  handle: {
    access: "view-events",
  },
};

export const EventsRouteWithTab = {
  ...EventsRoute,
  path: "/:realm/events/:tab",
};

export const toEvents = (params: EventsParams): Partial<Path> => {
  const path = params.tab ? EventsRouteWithTab.path : EventsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
