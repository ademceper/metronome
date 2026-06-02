import { Toaster } from "@metronome/ui/components/sonner";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { routeTree } from "./routeTree.gen";

// Mirror account/app/Root.tsx: build a single QueryClient + TanStack router
// at this layer so the rest of the theme can lean on useQuery / typed Link
// without re-creating providers per route. Hash history is preserved because
// the admin theme historically deep-links via the URL fragment.
export const Root = () => {
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
        queryCache: new QueryCache(),
      }),
  );

  const router = useMemo(() => {
    const hashHistory = createHashHistory();
    return createRouter({
      routeTree,
      history: hashHistory,
      defaultPreload: false,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
};
