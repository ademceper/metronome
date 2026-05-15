import { createFileRoute } from '@tanstack/react-router';
import { ConfigureWorkflow } from '@/components/workflow-editor/configure-workflow';

export const Route = createFileRoute('/_app/env/$environmentSlug/workflows/$workflowSlug/')({
  component: ConfigureWorkflow,
});
