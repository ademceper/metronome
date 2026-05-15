import { createFileRoute } from '@tanstack/react-router';
import { CatchAllRoute } from '@/route-utils';

export const Route = createFileRoute('/_app/')({
  component: CatchAllRoute,
});
