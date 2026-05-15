import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { TestWorkflowRouteHandler } from '@/pages/test-workflow-route-handler';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.EVENT_WRITE}>
      <TestWorkflowRouteHandler />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/workflows/$workflowSlug/test')({
  component: Component,
});
