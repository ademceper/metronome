// @ts-nocheck

// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../utils/generateEncodedPath";

// ─── from realm/paths/Realms.ts ─────
export type RealmParams = { realm: string };
export const RealmRoute = {
  path: "/:realm/realms",
  handle: {
    access: "anyone",
  },
};

export const toRealm = (params: RealmParams): Partial<Path> => ({
  pathname: generateEncodedPath(RealmRoute.path, params),
});
