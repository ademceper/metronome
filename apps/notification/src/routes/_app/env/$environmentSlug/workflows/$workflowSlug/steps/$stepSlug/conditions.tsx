import { createFileRoute } from '@tanstack/react-router';
import { EditStepConditions } from '@/components/workflow-editor/steps/conditions/edit-step-conditions';

export const Route = createFileRoute('/_app/env/$environmentSlug/workflows/$workflowSlug/steps/$stepSlug/conditions')({
  component: EditStepConditions,
});
