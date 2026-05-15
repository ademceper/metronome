import { createFileRoute } from '@tanstack/react-router';
import { AgentsUsecasePage } from '@/pages/agents-usecase-page';

export const Route = createFileRoute('/onboarding/agents')({
  component: AgentsUsecasePage,
});
