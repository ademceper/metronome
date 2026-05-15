import { createFileRoute } from "@tanstack/react-router"
import ScopeDetails from "../../../../../clients/authorization/ScopeDetails"

export const Route = createFileRoute("/$realm/clients/$id/authorization/scope")({
  component: ScopeDetails,
})
