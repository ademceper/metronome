import { createFileRoute } from "@tanstack/react-router"
import GroupsSection from "../../../../../components/groups/GroupsSection"

export const Route = createFileRoute("/$realm/organizations/$orgId/groups/$")({
  component: GroupsSection,
})
