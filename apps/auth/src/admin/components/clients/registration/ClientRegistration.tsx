/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/registration/ClientRegistration.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../../../shared/keycloak-ui-shared";
import {
  RoutableTabs,
  useRoutableTab,
} from "../../routable-tabs/RoutableTabs";
import { useRealm } from "../../../context/realm-context/RealmContext";
import {
  ClientRegistrationTab,
  toClientRegistration,
} from "../../../lib/clients";
import { ClientRegistrationList } from "./ClientRegistrationList";
import { Tab, TabTitleText } from "../../../../shared/pf-compat"



export const ClientRegistration = () => {
  const { t } = useTranslation();
  const { realm } = useRealm();

  const useTab = (subTab: ClientRegistrationTab) =>
    useRoutableTab(toClientRegistration({ realm, subTab }));

  const anonymousTab = useTab("anonymous");
  const authenticatedTab = useTab("authenticated");

  return (
    <RoutableTabs
      defaultLocation={toClientRegistration({ realm, subTab: "anonymous" })}
      mountOnEnter
      unmountOnExit
    >
      <Tab
        data-testid="anonymous"
        title={
          <TabTitleText>
            {t("anonymousAccessPolicies")}{" "}
            <HelpItem
              fieldLabelId=""
              helpText={t("anonymousAccessPoliciesHelp")}
              noVerticalAlign={false}
              unWrap
            />
          </TabTitleText>
        }
        {...anonymousTab}
      >
        <ClientRegistrationList subType="anonymous" />
      </Tab>
      <Tab
        data-testid="authenticated"
        title={
          <TabTitleText>
            {t("authenticatedAccessPolicies")}{" "}
            <HelpItem
              fieldLabelId=""
              helpText={t("authenticatedAccessPoliciesHelp")}
              noVerticalAlign={false}
              unWrap
            />
          </TabTitleText>
        }
        {...authenticatedTab}
      >
        <ClientRegistrationList subType="authenticated" />
      </Tab>
    </RoutableTabs>
  );
};
