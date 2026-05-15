import { createFileRoute } from "@tanstack/react-router"
import MappingDetails from "../../../../../../../../client-scopes/details/MappingDetails"

export const Route = createFileRoute("/$realm/clients/$id/clientScopes/dedicated/mappers/$mapperId/$viewMode")({
  component: MappingDetails,
})
