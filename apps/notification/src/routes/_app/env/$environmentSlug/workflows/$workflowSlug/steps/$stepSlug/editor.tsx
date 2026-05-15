import { createFileRoute } from '@tanstack/react-router';
import { EditStepTemplateV2Page } from '@/pages/edit-step-template-v2';

export const Route = createFileRoute('/_app/env/$environmentSlug/workflows/$workflowSlug/steps/$stepSlug/editor')({
  component: EditStepTemplateV2Page,
});
