import { createFileRoute } from '@tanstack/react-router';
import { AgentsSetupPage } from '@/pages/agents-setup-page';

export const Route = createFileRoute('/onboarding/agents/setup')({
  component: AgentsSetupPage,
});
