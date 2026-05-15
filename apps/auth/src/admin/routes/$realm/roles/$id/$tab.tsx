import { createFileRoute } from "@tanstack/react-router"
import RealmRoleTabs from "../../../../components/realm-roles/RealmRoleTabs"

export const Route = createFileRoute("/$realm/roles/$id/$tab")({
  component: RealmRoleTabs,
})
