import { createFileRoute } from '@tanstack/react-router';
import { RedirectToLegacyStudioAuth } from '@/pages/redirect-to-legacy-studio-auth';

export const Route = createFileRoute('/_app/local-studio/auth')({
  component: RedirectToLegacyStudioAuth,
});
