import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DispatchProtectedRoute } from '@/route-utils/dispatch-protected-route';

function Component() {
  return (
    <DispatchProtectedRoute>
      <Outlet />
    </DispatchProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/dispatch')({
  component: Component,
});
