import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { TemplateModal } from '@/pages';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.WORKFLOW_WRITE} isDrawerRoute>
      <TemplateModal />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/workflows/templates/$templateId')({
  component: Component,
});
