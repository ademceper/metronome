import { Toaster } from "@metronome/ui/components/sonner";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useEnvironment } from "../shared/keycloak-ui-shared";
import { type AccountEnvironment } from ".";
import { routeTree } from "./routeTree.gen";

export const Root = () => {
  const context = useEnvironment<AccountEnvironment>();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

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

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
};
