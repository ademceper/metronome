import { createFileRoute } from "@tanstack/react-router"
import AddSpiffeConnect from "../../../../components/identity-providers/add/AddSpiffeConnect"

export const Route = createFileRoute("/$realm/identity-providers/spiffe/add")({
  component: AddSpiffeConnect,
})
