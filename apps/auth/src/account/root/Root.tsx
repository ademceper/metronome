/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Root.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  ErrorPage,
  useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { Spinner as UISpinner } from "@metronome/ui/components/spinner";
import {
  createRootRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { Suspense, useMemo } from "react";
import { type AccountEnvironment } from "..";
import { Header } from "./Header";
import { PageNav } from "./PageNav";
import { buildAccountRoutes } from "../routes";

const Spinner = ({ size, ...props }: any) => <UISpinner {...props} />;

const AccountLayout = () => (
  <div className="flex min-h-svh flex-col">
    <Header />
    <div className="container mx-auto flex max-w-6xl flex-1 flex-col px-4 py-6">
      <div className="grid flex-1 grid-cols-1 gap-0 md:grid-cols-[280px_1fr]">
        <aside className="md:border-r md:pe-2">
          <div className="md:sticky md:top-20">
            <PageNav />
          </div>
        </aside>
        <main className="min-w-0 md:ps-8">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  </div>
);

export const Root = () => {
  const context = useEnvironment<AccountEnvironment>();

  const router = useMemo(() => {
    const basepath = decodeURIComponent(
      new URL(context.environment.baseUrl).pathname,
    ).replace(/\/$/, "");

    const rootRoute = createRootRoute({
      component: AccountLayout,
      errorComponent: ErrorPage,
      notFoundComponent: ErrorPage,
    });

    rootRoute.addChildren(buildAccountRoutes(rootRoute));

    return createRouter({
      routeTree: rootRoute,
      basepath: basepath || "/",
      defaultPreload: false,
    });
  }, [context.environment.baseUrl]);

  return <RouterProvider router={router} />;
};
