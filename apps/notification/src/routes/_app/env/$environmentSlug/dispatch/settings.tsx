import { createFileRoute } from '@tanstack/react-router';
import { DispatchSettingsPage } from '@/pages/dispatch';

export const Route = createFileRoute('/_app/env/$environmentSlug/dispatch/settings')({
  component: DispatchSettingsPage,
});
