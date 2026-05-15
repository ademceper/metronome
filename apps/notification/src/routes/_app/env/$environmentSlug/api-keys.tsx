import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { ApiKeysPage } from '@/pages';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.API_KEY_READ}>
      <ApiKeysPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/api-keys')({
  component: Component,
});
