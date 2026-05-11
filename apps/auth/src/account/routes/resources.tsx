/* eslint-disable */
// @ts-nocheck

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@metronome/ui/components/tabs";
import { ResourcesTab } from "./-resources/ResourcesTab";
import { Page } from "../components/page/Page";

export const Route = createFileRoute("/resources")({
  component: Resources,
});

function Resources() {
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
}
