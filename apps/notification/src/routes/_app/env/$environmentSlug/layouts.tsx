import { PermissionsEnum } from '@novu/shared';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { LayoutsPage } from '@/pages';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
      <LayoutsPage />
      <Outlet />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/layouts')({
  component: Component,
});
