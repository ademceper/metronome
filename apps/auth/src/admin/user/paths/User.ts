// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type UserTab =
  | "settings"
  | "groups"
  | "organizations"
  | "consents"
  | "attributes"
  | "sessions"
  | "credentials"
  | "role-mapping"
  | "identity-provider-links"
  | "events"
  | "workflows";

export type UserParams = {
  realm: string;
  id: string;
  tab: UserTab;
};
export const UserRoute = {
  path: "/:realm/users/:id/:tab",
  handle: {
    access: "query-users",
  },
};

export const toUser = (params: UserParams): Partial<Path> => ({
  pathname: generateEncodedPath(UserRoute.path, params),
});
