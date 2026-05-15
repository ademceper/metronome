import { createFileRoute } from "@tanstack/react-router"
import CreateClientScope from "../../../components/client-scopes/CreateClientScope"

export const Route = createFileRoute("/$realm/client-scopes/new")({
  component: CreateClientScope,
})
