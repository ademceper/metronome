import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { DuplicateLayoutPage } from '@/pages/duplicate-layout-page';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.WORKFLOW_WRITE} isDrawerRoute>
      <DuplicateLayoutPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/layouts/duplicate/$layoutId')({
  component: Component,
});
