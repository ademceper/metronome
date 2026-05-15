import { createFileRoute, Navigate } from '@tanstack/react-router';
import { SettingsPage } from '@/pages';
import { IS_SELF_HOSTED } from '@/config';
import { ROUTES } from '@/utils/routes';

function Component() {
  return IS_SELF_HOSTED ? <Navigate to={ROUTES.ROOT as never} /> : <SettingsPage />;
}

export const Route = createFileRoute('/_app/settings/billing')({
  component: Component,
});
