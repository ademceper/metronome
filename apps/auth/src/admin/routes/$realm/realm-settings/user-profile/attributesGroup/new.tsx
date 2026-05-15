import { createFileRoute } from "@tanstack/react-router"
import AttributesGroupDetails from "../../../../../realm-settings/user-profile/AttributesGroupDetails"

export const Route = createFileRoute("/$realm/realm-settings/user-profile/attributesGroup/new")({
  component: AttributesGroupDetails,
})
