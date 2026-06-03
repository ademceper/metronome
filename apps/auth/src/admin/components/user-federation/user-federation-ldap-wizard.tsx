/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/UserFederationLdapWizard.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { Wizard, WizardFooter, WizardFooterWrapper, WizardStep, useWizardContext } from "../../../shared/wizard";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import useIsFeatureEnabled, { Feature } from "../../utils/use-is-feature-enabled";
import { LdapSettingsAdvanced } from "./ldap/ldap-settings-advanced";
import { LdapSettingsConnection } from "./ldap/ldap-settings-connection";
import { LdapSettingsGeneral } from "./ldap/ldap-settings-general";
import { LdapSettingsKerberosIntegration } from "./ldap/ldap-settings-kerberos-integration";
import { LdapSettingsSearching } from "./ldap/ldap-settings-searching";
import { LdapSettingsSynchronization } from "./ldap/ldap-settings-synchronization";
import { SettingsCache } from "./shared/settings-cache";


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

const UserFedLdapFooter = () => {
  const { t } = useTranslation();
  const { activeStep, goToNextStep, goToPrevStep, close } = useWizardContext();
  return (
    <WizardFooter
      activeStep={activeStep}
      onNext={goToNextStep}
      onBack={goToPrevStep}
      onClose={close}
      isBackDisabled={activeStep.index === 1}
      backButtonText={t("back")}
      nextButtonText={t("next")}
      cancelButtonText={t("cancel")}
    />
  );
};
const SkipCustomizationFooter = () => {
  const { goToNextStep, goToPrevStep, close } = useWizardContext();
  const { t } = useTranslation();
  return (
    <WizardFooterWrapper>
      <Button variant="secondary" onClick={goToPrevStep}>
        {t("back")}
      </Button>
      <Button variant="primary" type="submit" onClick={goToNextStep}>
        {t("next")}
      </Button>
      {/* TODO: validate last step and finish */}
      <Button variant="link">{t("skipCustomizationAndFinish")}</Button>
      <Button variant="link" onClick={close}>
        {t("cancel")}
      </Button>
    </WizardFooterWrapper>
  );
};
export const UserFederationLdapWizard = () => {
  const form = useForm<ComponentRepresentation>();
  const { t } = useTranslation();
  const isFeatureEnabled = useIsFeatureEnabled();

  return (
    <Wizard height="100%" footer={<UserFedLdapFooter />}>
      <WizardStep name={t("requiredSettings")} id="ldapRequiredSettingsStep">
        <LdapSettingsGeneral
          form={form}
          showSectionHeading
          showSectionDescription
        />
      </WizardStep>
      <WizardStep
        name={t("connectionAndAuthenticationSettings")}
        id="ldapConnectionSettingsStep"
      >
        <LdapSettingsConnection
          form={form}
          showSectionHeading
          showSectionDescription
        />
      </WizardStep>
      <WizardStep
        name={t("ldapSearchingAndUpdatingSettings")}
        id="ldapSearchingSettingsStep"
      >
        <LdapSettingsSearching
          form={form}
          showSectionHeading
          showSectionDescription
        />
      </WizardStep>
      <WizardStep
        name={t("synchronizationSettings")}
        id="ldapSynchronizationSettingsStep"
        footer={<SkipCustomizationFooter />}
      >
        <LdapSettingsSynchronization
          form={form}
          showSectionHeading
          showSectionDescription
        />
      </WizardStep>
      <WizardStep
        name={t("kerberosIntegration")}
        id="ldapKerberosIntegrationSettingsStep"
        isDisabled={!isFeatureEnabled(Feature.Kerberos)}
        footer={<SkipCustomizationFooter />}
      >
        <LdapSettingsKerberosIntegration
          form={form}
          showSectionHeading
          showSectionDescription
        />
      </WizardStep>
      <WizardStep
        name={t("cacheSettings")}
        id="ldapCacheSettingsStep"
        footer={<SkipCustomizationFooter />}
      >
        <SettingsCache form={form} showSectionHeading showSectionDescription />
      </WizardStep>
      <WizardStep
        name={t("advancedSettings")}
        id="ldapAdvancedSettingsStep"
        footer={{
          backButtonText: t("back"),
          nextButtonText: t("finish"),
          cancelButtonText: t("cancel"),
        }}
      >
        <LdapSettingsAdvanced
          form={form}
          showSectionHeading
          showSectionDescription
        />
      </WizardStep>
    </Wizard>
  );
};
