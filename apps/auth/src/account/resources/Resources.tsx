/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/Resources.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { ResourcesTab } from "./ResourcesTab";
import { Page } from "../components/page/Page";
import { Tabs, Tab, TabTitleText } from "../../shared/pf-compat"



export const Resources = () => {
  const { t } = useTranslation();
  const [activeTabKey, setActiveTabKey] = useState(0);

  return (
    <Page title={t("resources")} description={t("resourceIntroMessage")}>
      <Tabs
        activeKey={activeTabKey}
        onSelect={(_, key) => setActiveTabKey(key as number)}
        mountOnEnter
        unmountOnExit
      >
        <Tab
          data-testid="myResources"
          eventKey={0}
          title={<TabTitleText>{t("myResources")}</TabTitleText>}
        >
          <ResourcesTab />
        </Tab>
        <Tab
          data-testid="sharedWithMe"
          eventKey={1}
          title={<TabTitleText>{t("sharedWithMe")}</TabTitleText>}
        >
          <ResourcesTab isShared />
        </Tab>
      </Tabs>
    </Page>
  );
};

export default Resources;
