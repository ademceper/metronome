import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { EditContextPage } from '@/pages/edit-context';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ} isDrawerRoute>
      <EditContextPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/contexts/$type/$id/edit')({
  component: Component,
});
