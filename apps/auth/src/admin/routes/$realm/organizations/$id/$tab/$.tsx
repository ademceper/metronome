import { createFileRoute } from "@tanstack/react-router"
import DetailOrganization from "../../../../../components/organizations/DetailOrganization"

export const Route = createFileRoute("/$realm/organizations/$id/$tab/$")({
  component: DetailOrganization,
})
