import { createFileRoute } from '@tanstack/react-router';
import { OnboardingParentRoute } from '@/route-utils/onboarding';

export const Route = createFileRoute('/onboarding')({
  component: OnboardingParentRoute,
});
