import { createFileRoute } from "@tanstack/react-router"
import NewClientForm from "../../../clients/add/NewClientForm"

export const Route = createFileRoute("/$realm/clients/add-client")({
  component: NewClientForm,
})
