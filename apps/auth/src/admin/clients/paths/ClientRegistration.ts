// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
export type ClientRegistrationTab = "anonymous" | "authenticated";

export type ClientRegistrationParams = {
  realm: string;
  subTab: ClientRegistrationTab;
};
export const ClientRegistrationRoute = {
  path: "/:realm/clients/client-registration/:subTab",
  handle: {
    access: "view-clients",
  },
};

export const toClientRegistration = (
  params: ClientRegistrationParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(ClientRegistrationRoute.path, params),
});
