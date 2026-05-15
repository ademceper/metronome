import { createFileRoute } from '@tanstack/react-router';
import { WelcomePage } from '@/pages';

export const Route = createFileRoute('/_app/env/$environmentSlug/welcome')({
  component: WelcomePage,
});
