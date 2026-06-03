/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/ldap/LdapSettingsAdvanced.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../form/form-access";
import { WizardSectionHeader } from "../../wizard-section-header/wizard-section-header";
import { useRealm } from "../../../context/realm-context/realm-context";
import { convertFormToSettings } from "./ldap-settings-connection";


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
const FormGroup = ({ label, fieldId, isRequired, labelIcon, helperText, helperTextInvalid, validated, children, ...props }: any) => (
  <div className={cn("space-y-1.5", (props as any).className)}>
    {label ? (
      <label htmlFor={fieldId} className="font-medium text-sm">
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
        {labelIcon}
      </label>
    ) : null}
    {children}
    {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
    {helperTextInvalid ? <p className="text-destructive text-xs">{helperTextInvalid}</p> : null}
  </div>
);
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);

export type LdapSettingsAdvancedProps = {
  id?: string;
  form: UseFormReturn;
  showSectionHeading?: boolean;
  showSectionDescription?: boolean;
};

const PASSWORD_MODIFY_OID = "1.3.6.1.4.1.4203.1.11.1";

export const LdapSettingsAdvanced = ({
  id,
  form,
  showSectionHeading = false,
  showSectionDescription = false,
}: LdapSettingsAdvancedProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();

  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();

  const testLdap = async () => {
    if (!(await form.trigger())) return;
    try {
      const settings = convertFormToSettings(form);
      const ldapOids = await adminClient.realms.ldapServerCapabilities(
        { realm },
        { ...settings, componentId: id },
      );
      addAlert(t("testSuccess"));
      const passwordModifyOid = ldapOids.filter(
        (id: { oid: string }) => id.oid === PASSWORD_MODIFY_OID,
      );
      form.setValue("config.usePasswordModifyExtendedOp", [
        (passwordModifyOid.length > 0).toString(),
      ]);
    } catch (error) {
      addError("testError", error);
    }
  };

  return (
    <>
      {showSectionHeading && (
        <WizardSectionHeader
          title={t("advancedSettings")}
          description={t("ldapAdvancedSettingsDescription")}
          showDescription={showSectionDescription}
        />
      )}

      <FormAccess role="manage-realm" isHorizontal>
        <FormGroup
          label={t("enableLdapv3Password")}
          labelIcon={
            <HelpItem
              helpText={t("enableLdapv3PasswordHelp")}
              fieldLabelId="enableLdapv3Password"
            />
          }
          fieldId="kc-enable-ldapv3-password"
          hasNoPaddingTop
        >
          <Controller
            name="config.usePasswordModifyExtendedOp"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id={"kc-enable-ldapv3-password"}
                data-testid="ldapv3-password"
                isDisabled={false}
                onChange={(_event, value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("on")}
                labelOff={t("off")}
                aria-label={t("enableLdapv3Password")}
              />
            )}
          ></Controller>
        </FormGroup>

        <FormGroup
          label={t("validatePasswordPolicy")}
          labelIcon={
            <HelpItem
              helpText={t("validatePasswordPolicyHelp")}
              fieldLabelId="validatePasswordPolicy"
            />
          }
          fieldId="kc-validate-password-policy"
          hasNoPaddingTop
        >
          <Controller
            name="config.validatePasswordPolicy"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id={"kc-validate-password-policy"}
                data-testid="password-policy"
                isDisabled={false}
                onChange={(_event, value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("on")}
                labelOff={t("off")}
                aria-label={t("validatePasswordPolicy")}
              />
            )}
          ></Controller>
        </FormGroup>

        <FormGroup
          label={t("enableLdapPasswordPolicy")}
          labelIcon={
            <HelpItem
              helpText={t("enableLdapPasswordPolicyHelp")}
              fieldLabelId="enableLdapPasswordPolicy"
            />
          }
          fieldId="kc-enable-ldap-password-policy"
          hasNoPaddingTop
        >
          <Controller
            name="config.enableLdapPasswordPolicy"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id={"kc-enable-ldap-password-policy"}
                data-testid="ldap-password-policy"
                isDisabled={false}
                onChange={(_event, value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("on")}
                labelOff={t("off")}
                aria-label={t("enableLdapPasswordPolicy")}
              />
            )}
          ></Controller>
        </FormGroup>

        <FormGroup
          label={t("trustEmail")}
          labelIcon={
            <HelpItem
              helpText={t("trustEmailHelp")}
              fieldLabelId="trustEmail"
            />
          }
          fieldId="kc-trust-email"
          hasNoPaddingTop
        >
          <Controller
            name="config.trustEmail"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id={"kc-trust-email"}
                data-testid="trust-email"
                isDisabled={false}
                onChange={(_event, value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("on")}
                labelOff={t("off")}
                aria-label={t("trustEmail")}
              />
            )}
          ></Controller>
        </FormGroup>
        <FormGroup
          label={t("connectionTrace")}
          labelIcon={
            <HelpItem
              helpText={t("connectionTraceHelp")}
              fieldLabelId="connectionTrace"
            />
          }
          fieldId="kc-connection-trace"
          hasNoPaddingTop
        >
          <Controller
            name="config.connectionTrace"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id={"kc-connection-trace"}
                data-testid="connection-trace"
                isDisabled={false}
                onChange={(_event, value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("on")}
                labelOff={t("off")}
                aria-label={t("connectionTrace")}
              />
            )}
          ></Controller>
        </FormGroup>
        <FormGroup fieldId="query-extensions">
          <Button
            variant="secondary"
            id="query-extensions"
            data-testid="query-extensions"
            onClick={testLdap}
          >
            {t("queryExtensions")}
          </Button>
        </FormGroup>
      </FormAccess>
    </>
  );
};
