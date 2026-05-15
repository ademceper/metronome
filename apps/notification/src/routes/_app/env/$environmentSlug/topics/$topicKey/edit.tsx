import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { EditTopicPage } from '@/pages/edit-topic';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute
      condition={(has) =>
        has({ permission: PermissionsEnum.TOPIC_WRITE }) ||
        has({ permission: PermissionsEnum.TOPIC_READ })
      }
      isDrawerRoute
    >
      <EditTopicPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/topics/$topicKey/edit')({
  component: Component,
});
