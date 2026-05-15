import { createFileRoute } from "@tanstack/react-router"
import CreateFlow from "../../../../authentication/form/CreateFlow"

export const Route = createFileRoute("/$realm/authentication/flows/create")({
  component: CreateFlow,
})
