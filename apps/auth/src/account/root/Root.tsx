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
  KeycloakContext,
} from "../../shared/keycloak-ui-shared";
import { Spinner as UISpinner } from "@metronome/ui/components/spinner";
import { Suspense, useState } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import fetchContentJson from "../content/fetchContent";
import { type AccountEnvironment } from "..";
import { usePromise } from "../utils/usePromise";
import { Header } from "./Header";
import { type MenuItem, PageNav } from "./PageNav";
import { routes } from "../routes";


const Spinner = ({ size, ...props }: any) => <UISpinner {...props} />;

function mapRoutes(
  context: KeycloakContext<AccountEnvironment>,
  content: MenuItem[],
): RouteObject[] {
  return content
    .map((item) => {
      if ("children" in item) {
        return mapRoutes(context, item.children);
      }

      // Do not add route disabled via feature flags
      if (item.isVisible && !context.environment.features[item.isVisible]) {
        return null;
      }

      return {
        ...item,
        element:
          "path" in item
            ? routes.find((r) => r.path === (item.id ?? item.path))?.element
            : undefined,
      };
    })
    .filter((item) => !!item)
    .flat();
}

export const Root = () => {
  const context = useEnvironment<AccountEnvironment>();
  const [content, setContent] = useState<RouteObject[]>();

  usePromise(
    (signal) => fetchContentJson({ signal, context }),
    (content) => {
      setContent([
        {
          path: decodeURIComponent(
            new URL(context.environment.baseUrl).pathname,
          ),
          element: (
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
          ),
          errorElement: <ErrorPage />,
          children: mapRoutes(context, content),
        },
      ]);
    },
  );

  if (!content) {
    return <Spinner />;
  }
  return <RouterProvider router={createBrowserRouter(content)} />;
};
