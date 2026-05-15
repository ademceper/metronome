// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ClientProfileParams = {
  realm: string;
  profileName: string;
};
export const ClientProfileRoute = {
  path: "/:realm/realm-settings/client-policies/:profileName/edit-profile",
  handle: {
    access: ["view-realm", "view-users"],
  },
};

export const toClientProfile = (
  params: ClientProfileParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(ClientProfileRoute.path, params),
});
