import { createFileRoute } from "@tanstack/react-router"
import NewClientForm from "../../../components/clients/add/NewClientForm"

export const Route = createFileRoute("/$realm/clients/add-client")({
  component: NewClientForm,
})
