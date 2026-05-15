import { createFileRoute } from "@tanstack/react-router"
import AddOpenIdConnect from "../../../../components/identity-providers/add/AddOpenIdConnect"

export const Route = createFileRoute("/$realm/identity-providers/oidc/add")({
  component: AddOpenIdConnect,
})
