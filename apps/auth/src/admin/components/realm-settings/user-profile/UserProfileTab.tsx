/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/UserProfileTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { useTranslation } from "react-i18next";
import {
  RoutableTabs,
  useRoutableTab,
} from "../../routable-tabs/RoutableTabs";
import { useRealm } from "../../../context/realm-context/RealmContext";
import {
  toUserProfile,
  UserProfileTab as IUserProfileTab,
} from "../../../lib/realm-settings";
import { AttributesGroupTab } from "./AttributesGroupTab";
import { AttributesTab } from "./AttributesTab";
import { JsonEditorTab } from "./JsonEditorTab";
import { UserProfileProvider } from "./UserProfileContext";
import { Tab, TabTitleText } from "../../../../shared/pf-compat"



type UserProfileTabProps = {
  setTableData: React.Dispatch<
    React.SetStateAction<Record<string, string>[] | undefined>
  >;
};

export const UserProfileTab = ({ setTableData }: UserProfileTabProps) => {
  const { realm } = useRealm();
  const { t } = useTranslation();

  const useTab = (tab: IUserProfileTab) =>
    useRoutableTab(toUserProfile({ realm, tab }));

  const attributesTab = useTab("attributes");
  const attributesGroupTab = useTab("attributes-group");
  const jsonEditorTab = useTab("json-editor");

  return (
    <UserProfileProvider>
      <RoutableTabs
        defaultLocation={toUserProfile({ realm, tab: "attributes" })}
        mountOnEnter
      >
        <Tab
          title={<TabTitleText>{t("attributes")}</TabTitleText>}
          data-testid="attributesTab"
          {...attributesTab}
        >
          <AttributesTab setTableData={setTableData} />
        </Tab>
        <Tab
          title={<TabTitleText>{t("attributesGroup")}</TabTitleText>}
          data-testid="attributesGroupTab"
          {...attributesGroupTab}
        >
          <AttributesGroupTab setTableData={setTableData} />
        </Tab>
        <Tab
          title={<TabTitleText>{t("jsonEditor")}</TabTitleText>}
          data-testid="jsonEditorTab"
          {...jsonEditorTab}
        >
          <JsonEditorTab />
        </Tab>
      </RoutableTabs>
    </UserProfileProvider>
  );
};
