import { createFileRoute } from "@tanstack/react-router"
import MappingDetails from "../../../../../../components/client-scopes/details/MappingDetails"

export const Route = createFileRoute("/$realm/client-scopes/$id/mappers/$mapperId/$viewMode")({
  component: MappingDetails,
})
