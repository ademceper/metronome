import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { VercelIntegrationPage } from '@/pages/vercel-integration-page';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.PARTNER_INTEGRATION_READ}>
      <VercelIntegrationPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/partner-integrations/vercel')({
  component: Component,
});
