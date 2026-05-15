import { PermissionsEnum } from '@novu/shared';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { EditWorkflowPage } from '@/pages/edit-workflow';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
      <EditWorkflowPage />
      <Outlet />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/workflows/$workflowSlug')({
  component: Component,
});
