// @ts-nocheck
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import { ClientRegistrationTab } from "./ClientRegistration";

export type RegistrationProviderParams = {
  realm: string;
  subTab: ClientRegistrationTab;
  id?: string;
  providerId: string;
};
export const AddRegistrationProviderRoute = {
  path: "/:realm/clients/client-registration/:subTab/:providerId",
  handle: {
    access: "manage-clients",
  },
};

export const EditRegistrationProviderRoute = {
  ...AddRegistrationProviderRoute,
  path: "/:realm/clients/client-registration/:subTab/:providerId/:id",
};

export const toRegistrationProvider = (
  params: RegistrationProviderParams,
): Partial<Path> => {
  const path = params.id
    ? EditRegistrationProviderRoute.path
    : AddRegistrationProviderRoute.path;

  return {
    pathname: generateEncodedPath(path, params),
  };
};
