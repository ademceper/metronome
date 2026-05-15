import { createFileRoute } from "@tanstack/react-router"
import ClientDetails from "../../../../../components/clients/ClientDetails"

export const Route = createFileRoute("/$realm/clients/$clientId/authorization/$tab")({
  component: ClientDetails,
})
