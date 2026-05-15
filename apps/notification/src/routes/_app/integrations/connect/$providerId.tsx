import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { CreateIntegrationSidebar } from '@/components/integrations/components/create-integration-sidebar';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.INTEGRATION_WRITE} isDrawerRoute>
      <CreateIntegrationSidebar isOpened />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/integrations/connect/$providerId')({
  component: Component,
});
