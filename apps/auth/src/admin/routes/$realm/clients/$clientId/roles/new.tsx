import { createFileRoute } from "@tanstack/react-router"
import CreateClientRole from "../../../../../clients/roles/CreateClientRole"

export const Route = createFileRoute("/$realm/clients/$clientId/roles/new")({
  component: CreateClientRole,
})
