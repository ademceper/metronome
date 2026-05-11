/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/policies/Policies.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeycloakSpinner } from "../../../shared/keycloak-ui-shared";
import { useRealm } from "../../context/realm-context/RealmContext";
import { CibaPolicy } from "./CibaPolicy";
import { OtpPolicy } from "./OtpPolicy";
import { PasswordPolicy } from "./PasswordPolicy";
import { WebauthnPolicy } from "./WebauthnPolicy";
import { Tabs, Tab, TabTitleText } from "../../../shared/pf-compat"



export const Policies = () => {
  const { t } = useTranslation();
  const [subTab, setSubTab] = useState(1);
  const { realmRepresentation: realm, refresh } = useRealm();

  if (!realm) {
    return <KeycloakSpinner />;
  }

  return (
    <Tabs
      activeKey={subTab}
      onSelect={(_, key) => setSubTab(key as number)}
      mountOnEnter
      unmountOnExit
    >
      <Tab
        id="passwordPolicy"
        data-testid="passwordPolicy"
        eventKey={1}
        title={<TabTitleText>{t("passwordPolicy")}</TabTitleText>}
      >
        <PasswordPolicy realm={realm} realmUpdated={refresh} />
      </Tab>
      <Tab
        id="otpPolicy"
        data-testid="otpPolicy"
        eventKey={2}
        title={<TabTitleText>{t("otpPolicy")}</TabTitleText>}
      >
        <OtpPolicy realm={realm} realmUpdated={refresh} />
      </Tab>
      <Tab
        id="webauthnPolicy"
        data-testid="webauthnPolicy"
        eventKey={3}
        title={<TabTitleText>{t("webauthnPolicy")}</TabTitleText>}
      >
        <WebauthnPolicy realm={realm} realmUpdated={refresh} />
      </Tab>
      <Tab
        id="webauthnPasswordlessPolicy"
        data-testid="webauthnPasswordlessPolicy"
        eventKey={4}
        title={<TabTitleText>{t("webauthnPasswordlessPolicy")}</TabTitleText>}
      >
        <WebauthnPolicy realm={realm} realmUpdated={refresh} isPasswordLess />
      </Tab>
      <Tab
        data-testid="tab-ciba-policy"
        eventKey={5}
        title={<TabTitleText>{t("cibaPolicy")}</TabTitleText>}
      >
        <CibaPolicy realm={realm} realmUpdated={refresh} />
      </Tab>
    </Tabs>
  );
};
