// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type UserProfileTab =
  | "attributes"
  | "attributes-group"
  | "unmanaged-attributes"
  | "json-editor";

export type UserProfileParams = {
  realm: string;
  tab: UserProfileTab;
};
export const UserProfileRoute = {
  path: "/:realm/realm-settings/user-profile/:tab",
  handle: {
    access: "view-realm",
  },
};

export const toUserProfile = (params: UserProfileParams): Partial<Path> => ({
  pathname: generateEncodedPath(UserProfileRoute.path, params),
});
