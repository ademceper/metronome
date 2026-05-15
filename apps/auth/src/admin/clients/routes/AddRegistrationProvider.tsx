/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/routes/AddRegistrationProvider.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../route-utils";
import { ClientRegistrationTab } from "./ClientRegistration";

export type RegistrationProviderParams = {
  realm: string;
  subTab: ClientRegistrationTab;
  id?: string;
  providerId: string;
};

const DetailProvider = lazy(() => import("../registration/DetailProvider"));

export const AddRegistrationProviderRoute: AppRouteObject = {
  path: "/:realm/clients/client-registration/:subTab/:providerId",
  element: <DetailProvider />,
  breadcrumb: (t) => t("clientSettings"),
  handle: {
    access: "manage-clients",
  },
};

export const EditRegistrationProviderRoute: AppRouteObject = {
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
