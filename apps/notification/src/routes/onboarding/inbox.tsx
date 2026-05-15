import { createFileRoute } from '@tanstack/react-router';
import { InboxUsecasePage } from '@/pages/inbox-usecase-page';

export const Route = createFileRoute('/onboarding/inbox')({
  component: InboxUsecasePage,
});
