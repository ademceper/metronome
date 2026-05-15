import { createFileRoute } from '@tanstack/react-router';
import { DispatchConversationsPage } from '@/pages/dispatch';

export const Route = createFileRoute('/_app/env/$environmentSlug/dispatch/conversations')({
  component: DispatchConversationsPage,
});
