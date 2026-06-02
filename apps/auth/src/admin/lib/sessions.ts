// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generate-encoded-path";

// ─── from sessions/paths/Sessions.ts ─────
export type SessionsParams = { realm: string };
export const SessionsRoute = {
  path: "/:realm/sessions",
  handle: {
    access: ["view-realm", "view-clients", "view-users"],
  },
};

export const toSessions = (params: SessionsParams): Partial<Path> => ({
  pathname: generateEncodedPath(SessionsRoute.path, params),
});
