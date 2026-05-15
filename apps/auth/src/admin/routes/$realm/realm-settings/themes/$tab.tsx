import { createFileRoute } from "@tanstack/react-router"
import RealmSettingsSection from "../../../../components/realm-settings/RealmSettingsSection"

export const Route = createFileRoute("/$realm/realm-settings/themes/$tab")({
  component: RealmSettingsSection,
})
