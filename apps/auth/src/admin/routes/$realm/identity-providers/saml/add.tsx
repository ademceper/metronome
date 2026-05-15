import { createFileRoute } from "@tanstack/react-router"
import AddSamlConnect from "../../../../identity-providers/add/AddSamlConnect"

export const Route = createFileRoute("/$realm/identity-providers/saml/add")({
  component: AddSamlConnect,
})
