import { createFileRoute, Outlet } from '@tanstack/react-router';
import { VariablesPage } from '@/pages/variables';

function Component() {
  return (
    <>
      <VariablesPage />
      <Outlet />
    </>
  );
}

export const Route = createFileRoute('/_app/env/$environmentSlug/variables')({
  component: Component,
});
