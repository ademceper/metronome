import { createFileRoute } from "@tanstack/react-router"
import WorkflowsSection from "../../../components/workflows/WorkflowsSection"

export const Route = createFileRoute("/$realm/workflows/")({
  component: WorkflowsSection,
})
