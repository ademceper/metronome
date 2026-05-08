/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/routes/CreateInitialAccessToken.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { Path } from "react-router-dom";
import { generateEncodedPath } from "../../utils/generateEncodedPath";
import type { AppRouteObject } from "../../routes";

export type CreateInitialAccessTokenParams = { realm: string };

const CreateInitialAccessToken = lazy(
  () => import("../initial-access/CreateInitialAccessToken"),
);

export const CreateInitialAccessTokenRoute: AppRouteObject = {
  path: "/:realm/clients/initialAccessToken/create",
  element: <CreateInitialAccessToken />,
  breadcrumb: (t) => t("createToken"),
  handle: {
    access: "manage-clients",
  },
};

export const toCreateInitialAccessToken = (
  params: CreateInitialAccessTokenParams,
): Partial<Path> => ({
  pathname: generateEncodedPath(CreateInitialAccessTokenRoute.path, params),
});
