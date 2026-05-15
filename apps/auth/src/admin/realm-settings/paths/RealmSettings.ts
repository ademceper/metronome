// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type RealmSettingsTab =
  | "general"
  | "login"
  | "email"
  | "themes"
  | "keys"
  | "events"
  | "localization"
  | "security-defenses"
  | "sessions"
  | "tokens"
  | "client-policies"
  | "user-profile"
  | "user-registration";

export type RealmSettingsParams = {
  realm: string;
  tab?: RealmSettingsTab;
};
export const RealmSettingsRoute = {
  path: "/:realm/realm-settings",
  handle: {
    access: "view-realm",
  },
};

export const RealmSettingsRouteWithTab = {
  ...RealmSettingsRoute,
  path: "/:realm/realm-settings/:tab",
};

export const toRealmSettings = (params: RealmSettingsParams): Partial<Path> => {
  const path = params.tab
    ? RealmSettingsRouteWithTab.path
    : RealmSettingsRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
