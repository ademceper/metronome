// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { RealmSettingsTabs } from "../../../../components/realm-settings/RealmSettingsTabs";

function RealmSettingsSection() {
  return <RealmSettingsTabs />;
}

export const Route = createFileRoute("/$realm/realm-settings/user-profile/$tab")({
  component: RealmSettingsSection,
})
