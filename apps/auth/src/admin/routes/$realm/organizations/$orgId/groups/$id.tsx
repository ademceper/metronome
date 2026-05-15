import { createFileRoute } from "@tanstack/react-router"
import GroupsSection from "../../../../../groups/GroupsSection"

export const Route = createFileRoute("/$realm/organizations/$orgId/groups/$id")({
  component: GroupsSection,
})
