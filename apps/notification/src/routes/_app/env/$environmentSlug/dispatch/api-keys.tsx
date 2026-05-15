import { createFileRoute } from '@tanstack/react-router';
import { DispatchApiKeysPage } from '@/pages/dispatch';

export const Route = createFileRoute('/_app/env/$environmentSlug/dispatch/api-keys')({
  component: DispatchApiKeysPage,
});
