import { createFileRoute } from '@tanstack/react-router';
import { InboxEmbedPage } from '@/pages/inbox-embed-page';

export const Route = createFileRoute('/onboarding/inbox/embed')({
  component: InboxEmbedPage,
});
