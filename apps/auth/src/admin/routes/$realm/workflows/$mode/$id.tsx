import { createFileRoute } from "@tanstack/react-router"
import WorkflowDetailForm from "../../../../components/workflows/WorkflowDetailForm"

export const Route = createFileRoute("/$realm/workflows/$mode/$id")({
  component: WorkflowDetailForm,
})
