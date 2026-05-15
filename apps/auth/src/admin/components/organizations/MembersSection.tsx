/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/MembersSection.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Invitations } from "./Invitations";
import { Members } from "./Members";
import { Tabs, Tab, TabTitleText } from "../../../shared/pf-compat"



export const MembersSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("members");

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(_, key) => setActiveTab(key as string)}
    >
      <Tab
        eventKey="members"
        title={<TabTitleText>{t("members")}</TabTitleText>}
        data-testid="organization-members-tab"
      >
        <Members />
      </Tab>
      <Tab
        eventKey="invitations"
        title={<TabTitleText>{t("invitations")}</TabTitleText>}
        data-testid="organization-invitations-tab"
      >
        <Invitations />
      </Tab>
    </Tabs>
  );
};
