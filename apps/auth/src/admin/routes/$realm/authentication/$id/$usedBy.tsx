import { createFileRoute } from "@tanstack/react-router"
import FlowDetails from "../../../../authentication/FlowDetails"

export const Route = createFileRoute("/$realm/authentication/$id/$usedBy")({
  component: FlowDetails,
})
