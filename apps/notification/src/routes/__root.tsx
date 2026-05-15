import { createRootRoute } from '@tanstack/react-router';
import { ErrorPage } from '@/pages';
import { RootRoute } from '@/route-utils';

export const Route = createRootRoute({
  component: RootRoute,
  errorComponent: ErrorPage,
});
