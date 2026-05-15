/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/DetailOrganization.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  FormSubmitButton,
  useAlerts,
  useFetch,
} from "../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger } from "@metronome/ui/components/tabs";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../admin-client";
import { FormAccess } from "../components/form/FormAccess";
import { AttributesForm } from "../components/key-value-form/AttributeForm";
import { arrayToKeyValue } from "../components/key-value-form/key-value-convert";
import {
  RoutableTabs,
  useRoutableTab,
} from "../components/routable-tabs/RoutableTabs";
import { useRealm } from "../context/realm-context/RealmContext";
import { useParams } from "../utils/useParams";
import { DetailOrganizationHeader } from "./DetailOraganzationHeader";
import { IdentityProviders } from "./IdentityProviders";
import { MembersSection } from "./MembersSection";
import GroupsSection from "../groups/GroupsSection";
import {
  OrganizationForm,
  OrganizationFormType,
  convertToOrg,
} from "./OrganizationForm";
import {
  EditOrganizationParams,
  OrganizationTab,
  toEditOrganization,
} from "../lib/organizations";
import { useAccess } from "../context/access/Access";
import { AdminEvents } from "../events/AdminEvents";
import { useState } from "react";
import { Tabs, Tab, TabTitleText } from "../../shared/pf-compat"


const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;
const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

export default function DetailOrganization() {
  const { adminClient } = useAdminClient();
  const { addAlert, addError } = useAlerts();

  const { realm, realmRepresentation } = useRealm();
  const { id } = useParams<EditOrganizationParams>();
  const { t } = useTranslation();

  const form = useForm<OrganizationFormType>();

  const save = async (org: OrganizationFormType) => {
    try {
      const organization = convertToOrg(org);
      await adminClient.organizations.updateById({ id }, organization);
      addAlert(t("organizationSaveSuccess"));
    } catch (error) {
      addError("organizationSaveError", error);
    }
  };

  useFetch(
    () => adminClient.organizations.findOne({ id }),
    (org) => {
      if (!org) {
        throw new Error(t("notFound"));
      }
      form.reset({
        ...org,
        domains: org.domains?.map((d) => d.name),
        attributes: arrayToKeyValue(org.attributes),
      });
    },
    [id],
  );

  const useTab = (tab: OrganizationTab) =>
    useRoutableTab(
      toEditOrganization({
        realm,
        id,
        tab,
      }),
    );

  const settingsTab = useTab("settings");
  const attributesTab = useTab("attributes");
  const membersTab = useTab("members");
  const groupsTab = useTab("groups");
  const identityProvidersTab = useTab("identityProviders");
  const eventsTab = useTab("events");

  const { hasAccess } = useAccess();
  const [activeEventsTab, setActiveEventsTab] = useState("adminEvents");

  return (
    <PageSection variant="light" className="pf-v5-u-p-0">
      <FormProvider {...form}>
        <DetailOrganizationHeader save={() => save(form.getValues())} />
        <RoutableTabs
          data-testid="organization-tabs"
          aria-label={t("organization")}
          isBox
          mountOnEnter
        >
          <Tab
            id="settings"
            data-testid="settingsTab"
            title={<TabTitleText>{t("settings")}</TabTitleText>}
            {...settingsTab}
          >
            <PageSection>
              <FormAccess
                role="anyone"
                onSubmit={form.handleSubmit(save)}
                isHorizontal
              >
                <OrganizationForm readOnly />
                <ActionGroup>
                  <FormSubmitButton
                    formState={form.formState}
                    data-testid="save"
                  >
                    {t("save")}
                  </FormSubmitButton>
                  <Button
                    onClick={() => form.reset()}
                    data-testid="reset"
                    variant="link"
                  >
                    {t("reset")}
                  </Button>
                </ActionGroup>
              </FormAccess>
            </PageSection>
          </Tab>
          <Tab
            id="attributes"
            data-testid="attributeTab"
            title={<TabTitleText>{t("attributes")}</TabTitleText>}
            {...attributesTab}
          >
            <PageSection variant="light">
              <AttributesForm
                form={form}
                save={save}
                reset={() =>
                  form.reset({
                    ...form.getValues(),
                  })
                }
                name="attributes"
              />
            </PageSection>
          </Tab>
          <Tab
            id="members"
            data-testid="membersTab"
            title={<TabTitleText>{t("members")}</TabTitleText>}
            {...membersTab}
          >
            <MembersSection />
          </Tab>
          <Tab
            id="groups"
            data-testid="groupsTab"
            title={<TabTitleText>{t("groups")}</TabTitleText>}
            {...groupsTab}
          >
            <GroupsSection orgId={id} />
          </Tab>
          <Tab
            id="identityProviders"
            data-testid="identityProvidersTab"
            title={<TabTitleText>{t("identityProviders")}</TabTitleText>}
            {...identityProvidersTab}
          >
            <IdentityProviders />
          </Tab>
          {realmRepresentation?.adminEventsEnabled &&
            hasAccess("view-events") && (
              <Tab
                data-testid="admin-events-tab"
                title={<TabTitleText>{t("adminEvents")}</TabTitleText>}
                {...eventsTab}
              >
                <Tabs
                  activeKey={activeEventsTab}
                  onSelect={(_, key) => setActiveEventsTab(key as string)}
                >
                  <Tab
                    eventKey="adminEvents"
                    title={<TabTitleText>{t("adminEvents")}</TabTitleText>}
                  >
                    <AdminEvents resourcePath={`organizations/${id}`} />
                  </Tab>
                  <Tab
                    eventKey="membershipEvents"
                    title={<TabTitleText>{t("membershipEvents")}</TabTitleText>}
                  >
                    <AdminEvents resourcePath={`organizations/${id}/members`} />
                  </Tab>
                </Tabs>
              </Tab>
            )}
        </RoutableTabs>
      </FormProvider>
    </PageSection>
  );
}
