import { createFileRoute } from '@tanstack/react-router';
import { ChannelPreferences } from '@/components/workflow-editor/channel-preferences';

export const Route = createFileRoute('/_app/env/$environmentSlug/workflows/$workflowSlug/preferences')({
  component: ChannelPreferences,
});
