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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@metronome/ui/components/tabs";
import { ResourcesTab } from "./ResourcesTab";
import { Page } from "../components/page/Page";

export const Resources = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("my");

  return (
    <Page title={t("resources")} description={t("resourceIntroMessage")}>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="my" data-testid="myResources">
            {t("myResources")}
          </TabsTrigger>
          <TabsTrigger value="shared" data-testid="sharedWithMe">
            {t("sharedWithMe")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my">
          <ResourcesTab />
        </TabsContent>
        <TabsContent value="shared">
          <ResourcesTab isShared />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default Resources;
