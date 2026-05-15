// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type KeySubTab = "list" | "providers";

export type KeysParams = {
  realm: string;
  tab: KeySubTab;
};
export const KeysRoute = {
  path: "/:realm/realm-settings/keys/:tab",
  handle: {
    access: "view-realm",
  },
};

export const toKeysTab = (params: KeysParams): Partial<Path> => ({
  pathname: generateEncodedPath(KeysRoute.path, params),
});
