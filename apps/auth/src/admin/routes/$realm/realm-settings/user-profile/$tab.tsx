import { createFileRoute } from "@tanstack/react-router"
import RealmSettingsSection from "../../../../components/realm-settings/RealmSettingsSection"

export const Route = createFileRoute("/$realm/realm-settings/user-profile/$tab")({
  component: RealmSettingsSection,
})
