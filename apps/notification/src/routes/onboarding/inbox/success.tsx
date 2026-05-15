import { createFileRoute } from '@tanstack/react-router';
import { InboxEmbedSuccessPage } from '@/pages/inbox-embed-success-page';

export const Route = createFileRoute('/onboarding/inbox/success')({
  component: InboxEmbedSuccessPage,
});
