/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/themes/ThemesTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { useTranslation } from "react-i18next";
import {
  RoutableTabs,
  useRoutableTab,
} from "../../routable-tabs/routable-tabs";
import { useRealm } from "../../../context/realm-context/realm-context";
import useIsFeatureEnabled, { Feature } from "../../../utils/use-is-feature-enabled";
import { ThemesTabType, toThemesTab } from "../../../lib/realm-settings";
import { QuickTheme } from "./quick-theme";
import { ThemeSettingsTab } from "./theme-settings";
import { Tab, TabTitleText } from "../../../../shared/pf-compat"



type ThemesTabProps = {
  realm: RealmRepresentation;
  save: (realm: RealmRepresentation) => void;
};

export default function ThemesTab({ realm, save }: ThemesTabProps) {
  const { t } = useTranslation();
  const { realm: realmName } = useRealm();
  const isFeatureEnabled = useIsFeatureEnabled();

  const param = (tab: ThemesTabType) => ({
    realm: realmName,
    tab,
  });

  const settingsTab = useRoutableTab(toThemesTab(param("settings")));
  const quickThemeTab = useRoutableTab(toThemesTab(param("quickTheme")));

  if (!isFeatureEnabled(Feature.QuickTheme)) {
    return <ThemeSettingsTab realm={realm} save={save} />;
  }

  return (
    <RoutableTabs
      mountOnEnter
      unmountOnExit
      defaultLocation={toThemesTab({
        realm: realmName,
        tab: "settings",
      })}
    >
      <Tab
        id="themes-settings"
        title={<TabTitleText>{t("themes")} </TabTitleText>}
        data-testid="themes-settings-tab"
        {...settingsTab}
      >
        <ThemeSettingsTab realm={realm} save={save} />
      </Tab>
      <Tab
        id="quickTheme"
        title={<TabTitleText>{t("quickTheme")}</TabTitleText>}
        data-testid="quickTheme-tab"
        {...quickThemeTab}
      >
        <QuickTheme realm={realm} />
      </Tab>
    </RoutableTabs>
  );
}
