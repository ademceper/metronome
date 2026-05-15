import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { EditSubscriberPage } from '@/pages/edit-subscriber-page';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute
      condition={(has) =>
        has({ permission: PermissionsEnum.SUBSCRIBER_WRITE }) ||
        has({ permission: PermissionsEnum.SUBSCRIBER_READ })
      }
      isDrawerRoute
    >
      <EditSubscriberPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/subscribers/$subscriberId')({
  component: Component,
});
