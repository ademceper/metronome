import { createFileRoute } from '@tanstack/react-router';
import { TemplateModal } from '@/pages';

export const Route = createFileRoute('/_app/env/$environmentSlug/workflows/templates')({
  component: TemplateModal,
});
