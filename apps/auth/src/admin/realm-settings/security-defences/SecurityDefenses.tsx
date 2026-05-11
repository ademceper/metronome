/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/security-defences/SecurityDefenses.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { HeadersForm } from "./HeadersForm";
import { BruteForceDetection } from "./BruteForceDetection";
import { Tabs, Tab, TabTitleText } from "../../../shared/pf-compat"


const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

type SecurityDefensesProps = {
  realm: RealmRepresentation;
  save: (realm: RealmRepresentation) => void;
};

export const SecurityDefenses = ({ realm, save }: SecurityDefensesProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(10);
  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(_, key) => setActiveTab(key as number)}
    >
      <Tab
        id="headers"
        eventKey={10}
        data-testid="security-defenses-headers-tab"
        title={<TabTitleText>{t("headers")}</TabTitleText>}
      >
        <PageSection variant="light">
          <HeadersForm realm={realm} save={save} />
        </PageSection>
      </Tab>
      <Tab
        id="bruteForce"
        eventKey={20}
        data-testid="security-defenses-brute-force-tab"
        title={<TabTitleText>{t("bruteForceDetection")}</TabTitleText>}
      >
        <PageSection variant="light">
          <BruteForceDetection realm={realm} save={save} />
        </PageSection>
      </Tab>
    </Tabs>
  );
};
