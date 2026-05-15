import { createFileRoute } from "@tanstack/react-router"
import AddMapper from "../../../../../../identity-providers/add/AddMapper"

export const Route = createFileRoute("/$realm/identity-providers/$providerId/$alias/$tab/create")({
  component: AddMapper,
})
