import { createFileRoute } from "@tanstack/react-router"
import ClientDetails from "../../../../../components/clients/ClientDetails"

export const Route = createFileRoute("/$realm/clients/$clientId/clientScopes/$tab")({
  component: ClientDetails,
})
