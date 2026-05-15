import { createFileRoute } from "@tanstack/react-router"
import NewOrganization from "../../../components/organizations/NewOrganization"

export const Route = createFileRoute("/$realm/organizations/new")({
  component: NewOrganization,
})
