import { PermissionsEnum } from '@novu/shared';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SubscribersPage } from '@/pages/subscribers';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.SUBSCRIBER_READ}>
      <SubscribersPage />
      <Outlet />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/subscribers')({
  component: Component,
});
