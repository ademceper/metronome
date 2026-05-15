import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { DuplicateWorkflowPage } from '@/pages/duplicate-workflow';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.WORKFLOW_WRITE} isDrawerRoute>
      <DuplicateWorkflowPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/workflows/duplicate/$workflowId')({
  component: Component,
});
