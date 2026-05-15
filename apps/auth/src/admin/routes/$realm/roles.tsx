import { createFileRoute } from "@tanstack/react-router"
import RealmRolesSection from "../../components/realm-roles/RealmRolesSection"

export const Route = createFileRoute("/$realm/roles")({
  component: RealmRolesSection,
})
