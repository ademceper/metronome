import { createFileRoute } from "@tanstack/react-router"
import CreateRealmRole from "../../../realm-roles/CreateRealmRole"

export const Route = createFileRoute("/$realm/roles/new")({
  component: CreateRealmRole,
})
