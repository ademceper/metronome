import { createFileRoute } from "@tanstack/react-router"
import DedicatedScopes from "../../../../../components/clients/scopes/DedicatedScopes"

export const Route = createFileRoute("/$realm/clients/$clientId/clientScopes/dedicated")({
  component: DedicatedScopes,
})
