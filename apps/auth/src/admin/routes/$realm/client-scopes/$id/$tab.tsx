import { createFileRoute } from "@tanstack/react-router"
import EditClientScope from "../../../../client-scopes/EditClientScope"

export const Route = createFileRoute("/$realm/client-scopes/$id/$tab")({
  component: EditClientScope,
})
