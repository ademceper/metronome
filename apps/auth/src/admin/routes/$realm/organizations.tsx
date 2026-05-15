import { createFileRoute } from "@tanstack/react-router"
import OrganizationsSection from "../../components/organizations/OrganizationsSection"

export const Route = createFileRoute("/$realm/organizations")({
  component: OrganizationsSection,
})
