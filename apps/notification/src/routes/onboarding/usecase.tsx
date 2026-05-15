import { createFileRoute } from '@tanstack/react-router';
import { UsecaseSelectPage } from '@/pages/usecase-select-page';

export const Route = createFileRoute('/onboarding/usecase')({
  component: UsecaseSelectPage,
});
