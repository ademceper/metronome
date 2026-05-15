// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type AddClientProfileParams = {
  realm: string;
  tab: string;
};
export const AddClientProfileRoute = {
  path: "/:realm/realm-settings/client-policies/:tab/add-profile",
  handle: {
    access: "manage-realm",
  },
};

export const toAddClientProfile = (
  params: AddClientProfileParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(AddClientProfileRoute.path, params),
});
