import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorPage } from "../../shared/keycloak-ui-shared";
import { Header } from "../app/Header";
import { PageNav } from "../app/PageNav";
import { RouteFallback } from "./-loading/route-fallback";

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
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  </div>
);

export const Route = createRootRoute({
  component: AccountLayout,
  errorComponent: ErrorPage,
  notFoundComponent: () => <ErrorPage />,
});
