import { createFileRoute } from "@tanstack/react-router"
import DedicatedScopes from "../../../../../../clients/scopes/DedicatedScopes"

export const Route = createFileRoute("/$realm/clients/$clientId/clientScopes/dedicated/$tab")({
  component: DedicatedScopes,
})
