import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { TestWorkflowDrawerPage } from '@/pages/test-workflow-drawer-page';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.EVENT_WRITE} isDrawerRoute>
      <TestWorkflowDrawerPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/workflows/$workflowSlug/trigger')({
  component: Component,
});
