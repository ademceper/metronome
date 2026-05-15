import { createFileRoute } from "@tanstack/react-router"
import EditClientScope from "../../../../components/client-scopes/EditClientScope"

export const Route = createFileRoute("/$realm/client-scopes/$id/$tab")({
  component: EditClientScope,
})
