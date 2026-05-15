import { createFileRoute } from "@tanstack/react-router"
import FlowDetails from "../../../../components/authentication/FlowDetails"

export const Route = createFileRoute("/$realm/authentication/$id/$usedBy")({
  component: FlowDetails,
})
