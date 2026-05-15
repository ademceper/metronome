import { createFileRoute } from "@tanstack/react-router"
import ClientScopesSection from "../../client-scopes/ClientScopesSection"

export const Route = createFileRoute("/$realm/client-scopes")({
  component: ClientScopesSection,
})
