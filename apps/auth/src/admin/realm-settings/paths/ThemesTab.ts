// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ThemesTabType = "settings" | "quickTheme";

export type ThemesParams = {
  realm: string;
  tab: ThemesTabType;
};
export const ThemeTabRoute = {
  path: "/:realm/realm-settings/themes/:tab",
  handle: {
    access: "view-realm",
  },
};

export const toThemesTab = (params: ThemesParams): Partial<Path> => ({
  pathname: generateEncodedPath(ThemeTabRoute.path, params),
});
