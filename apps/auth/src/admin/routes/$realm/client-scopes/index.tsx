import { createFileRoute } from "@tanstack/react-router"
import ClientScopesSection from "../../../components/client-scopes/ClientScopesSection"

export const Route = createFileRoute("/$realm/client-scopes/")({
  component: ClientScopesSection,
})
