import { createFileRoute } from "@tanstack/react-router"
import OrganizationsSection from "../../organizations/OrganizationsSection"

export const Route = createFileRoute("/$realm/organizations")({
  component: OrganizationsSection,
})
