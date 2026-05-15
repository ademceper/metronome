import { createFileRoute } from "@tanstack/react-router"
import GroupsSection from "../../../groups/GroupsSection"

export const Route = createFileRoute("/$realm/groups/$id")({
  component: GroupsSection,
})
