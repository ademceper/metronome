import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { WebhooksPage } from '@/pages/webhooks-page';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute condition={(has) => has({ permission: PermissionsEnum.WEBHOOK_READ }) || has({ permission: PermissionsEnum.WEBHOOK_WRITE })}>
      <WebhooksPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/webhooks/logs')({
  component: Component,
});
