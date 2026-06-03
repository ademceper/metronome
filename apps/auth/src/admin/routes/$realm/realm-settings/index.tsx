// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { RealmSettingsTabs } from "../../../components/realm-settings/realm-settings-tabs";

function RealmSettingsSection() {
  return <RealmSettingsTabs />;
}

export const Route = createFileRoute("/$realm/realm-settings/")({
  component: () => (
    <div className="[&_[data-slot=tabs-list]]:hidden">
      <RealmSettingsSection />
    </div>
  ),
})
