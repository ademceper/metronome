import { createFileRoute } from '@tanstack/react-router';
import { DashboardRoute } from '@/route-utils';

export const Route = createFileRoute('/_app')({
  component: DashboardRoute,
});
