import { createFileRoute } from "@tanstack/react-router"
import ClientsSection from "../../../clients/ClientsSection"

export const Route = createFileRoute("/$realm/clients/$tab")({
  component: ClientsSection,
})
