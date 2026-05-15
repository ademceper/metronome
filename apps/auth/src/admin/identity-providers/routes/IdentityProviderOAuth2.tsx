/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/routes/IdentityProviderOAuth2.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { lazy } from "react";
import type { AppRouteObject } from "../../route-utils";

const AddOAuth2 = lazy(() => import("../add/AddOAuth2"));

export const IdentityProviderOAuth2Route: AppRouteObject = {
  path: "/:realm/identity-providers/oauth2/add",
  element: <AddOAuth2 />,
  breadcrumb: (t) => t("addOAuth2Provider"),
  handle: {
    access: "manage-identity-providers",
  },
};
