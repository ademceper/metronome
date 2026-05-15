import { createFileRoute } from "@tanstack/react-router"
import ResourceDetails from "../../../../../../clients/authorization/ResourceDetails"

export const Route = createFileRoute("/$realm/clients/$id/authorization/resource/$resourceId")({
  component: ResourceDetails,
})
