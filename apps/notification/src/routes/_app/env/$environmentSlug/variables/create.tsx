import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { UpsertVariablePage } from '@/pages/upsert-variable';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.ORG_SETTINGS_WRITE} isDrawerRoute>
      <UpsertVariablePage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/variables/create')({
  component: Component,
});
