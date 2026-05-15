import { createFileRoute } from "@tanstack/react-router"
import RealmRolesSection from "../../realm-roles/RealmRolesSection"

export const Route = createFileRoute("/$realm/roles")({
  component: RealmRolesSection,
})
