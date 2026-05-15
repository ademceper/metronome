import { PermissionsEnum } from '@novu/shared';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { ProtectedRoute } from '@/route-utils/protected-route';
import { ROUTES, buildRoute } from '@/utils/routes';
import { useParams } from 'react-router-dom';

function Component() {
  const params = useParams();
  const target = buildRoute(ROUTES.WEBHOOKS_ENDPOINTS, { environmentSlug: params.environmentSlug ?? '' });
  return (
    <ProtectedRoute condition={(has) => has({ permission: PermissionsEnum.WEBHOOK_READ }) || has({ permission: PermissionsEnum.WEBHOOK_WRITE })}>
      <Navigate to={target as never} replace />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/webhooks')({
  component: Component,
});
