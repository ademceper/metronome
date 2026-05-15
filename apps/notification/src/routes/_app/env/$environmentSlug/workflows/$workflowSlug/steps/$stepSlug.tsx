import { createFileRoute } from '@tanstack/react-router';
import { ConfigureStep } from '@/components/workflow-editor/steps/configure-step';

export const Route = createFileRoute('/_app/env/$environmentSlug/workflows/$workflowSlug/steps/$stepSlug')({
  component: ConfigureStep,
});
