import { createFileRoute } from "@tanstack/react-router"
import AddSamlConnect from "../../../../components/identity-providers/add/AddSamlConnect"

export const Route = createFileRoute("/$realm/identity-providers/saml/add")({
  component: AddSamlConnect,
})
