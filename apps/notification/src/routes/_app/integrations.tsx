import { PermissionsEnum } from '@novu/shared';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { IntegrationsListPage } from '@/pages';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.INTEGRATION_READ}>
      <IntegrationsListPage />
      <Outlet />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/integrations')({
  component: Component,
});
