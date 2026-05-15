import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { UpdateIntegrationSidebar } from '@/components/integrations/components/update-integration-sidebar';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute
      condition={(has) =>
        has({ permission: PermissionsEnum.INTEGRATION_WRITE }) ||
        has({ permission: PermissionsEnum.INTEGRATION_READ })
      }
      isDrawerRoute
    >
      <UpdateIntegrationSidebar isOpened />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/integrations/$integrationId/update')({
  component: Component,
});
