import { createFileRoute } from "@tanstack/react-router"
import AddOpenIdConnect from "../../../../identity-providers/add/AddOpenIdConnect"

export const Route = createFileRoute("/$realm/identity-providers/oidc/add")({
  component: AddOpenIdConnect,
})
