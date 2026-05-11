/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Root.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useMemo } from "react";
import { type AccountEnvironment } from "..";
import { routeTree } from "../routeTree.gen";

export const Root = () => {
  const context = useEnvironment<AccountEnvironment>();

  const router = useMemo(() => {
    const basepath = decodeURIComponent(
      new URL(context.environment.baseUrl).pathname,
    ).replace(/\/$/, "");

    return createRouter({
      routeTree,
      basepath: basepath || "/",
      defaultPreload: false,
    });
  }, [context.environment.baseUrl]);

  return <RouterProvider router={router} />;
};
