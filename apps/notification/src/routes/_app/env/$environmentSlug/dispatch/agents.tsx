import { createFileRoute } from '@tanstack/react-router';
import { AgentsPage } from '@/pages/agents';

export const Route = createFileRoute('/_app/env/$environmentSlug/dispatch/agents')({
  component: AgentsPage,
});
