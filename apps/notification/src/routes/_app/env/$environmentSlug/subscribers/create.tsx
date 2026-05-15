import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { CreateSubscriberPage } from '@/pages/create-subscriber';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.SUBSCRIBER_WRITE} isDrawerRoute>
      <CreateSubscriberPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/subscribers/create')({
  component: Component,
});
