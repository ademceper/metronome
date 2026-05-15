import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { AgentDetailsPage } from '@/pages/agent-details';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.AGENT_READ}>
      <AgentDetailsPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/dispatch/agents/$agentIdentifier/$agentTab')({
  component: Component,
});
