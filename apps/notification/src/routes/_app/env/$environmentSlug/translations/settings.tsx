import { PermissionsEnum } from '@novu/shared';
import { createFileRoute } from '@tanstack/react-router';
import { TranslationSettingsPage } from '@/pages/translation-settings-page';
import { ProtectedRoute } from '@/route-utils/protected-route';

function Component() {
  return (
    <ProtectedRoute permission={PermissionsEnum.WORKFLOW_READ}>
      <TranslationSettingsPage />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/translations/settings')({
  component: Component,
});
