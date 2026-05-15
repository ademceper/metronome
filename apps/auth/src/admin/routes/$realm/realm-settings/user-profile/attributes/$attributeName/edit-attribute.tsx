import { createFileRoute } from "@tanstack/react-router"
import NewAttributeSettings from "../../../../../../realm-settings/NewAttributeSettings"

export const Route = createFileRoute("/$realm/realm-settings/user-profile/attributes/$attributeName/edit-attribute")({
  component: NewAttributeSettings,
})
