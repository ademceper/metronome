import { createFileRoute } from '@tanstack/react-router';
import { DispatchDashboardPage } from '@/pages/dispatch';

export const Route = createFileRoute('/_app/env/$environmentSlug/dispatch/')({
  component: DispatchDashboardPage,
});
