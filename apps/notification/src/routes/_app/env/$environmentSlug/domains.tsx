import { createFileRoute, Navigate } from '@tanstack/react-router';
import { DomainsPage } from '@/pages/domains';
import { IS_SELF_HOSTED, IS_ENTERPRISE } from '@/config';
import { ROUTES } from '@/utils/routes';

function Component() {
  return !IS_SELF_HOSTED || IS_ENTERPRISE ? <DomainsPage /> : <Navigate to={ROUTES.ROOT as never} replace />;
}

export const Route = createFileRoute('/_app/env/$environmentSlug/domains')({
  component: Component,
});
