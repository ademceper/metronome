import { createFileRoute } from '@tanstack/react-router';
import { EnvironmentsPage } from '@/pages/environments';

export const Route = createFileRoute('/_app/env/$environmentSlug/environments')({
  component: EnvironmentsPage,
});
