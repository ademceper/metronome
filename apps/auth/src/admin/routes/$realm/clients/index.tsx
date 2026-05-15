import { createFileRoute } from "@tanstack/react-router"
import ClientsSection from "../../../components/clients/ClientsSection"

export const Route = createFileRoute("/$realm/clients/")({
  component: ClientsSection,
})
