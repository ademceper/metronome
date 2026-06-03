/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/ldap/LdapSettingsKerberosIntegration.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import {
  Controller,
  FormProvider,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelpItem, TextControl } from "../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../form/form-access";
import { WizardSectionHeader } from "../../wizard-section-header/wizard-section-header";


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

export type LdapSettingsKerberosIntegrationProps = {
  form: UseFormReturn;
  showSectionHeading?: boolean;
  showSectionDescription?: boolean;
};

export const LdapSettingsKerberosIntegration = ({
  form,
  showSectionHeading = false,
  showSectionDescription = false,
}: LdapSettingsKerberosIntegrationProps) => {
  const { t } = useTranslation();

  const allowKerberosAuth: [string] = useWatch({
    control: form.control,
    name: "config.allowKerberosAuthentication",
    defaultValue: ["false"],
  });

  return (
    <FormProvider {...form}>
      {showSectionHeading && (
        <WizardSectionHeader
          title={t("kerberosIntegration")}
          description={t("ldapKerberosSettingsDescription")}
          showDescription={showSectionDescription}
        />
      )}

      <FormAccess role="manage-realm" isHorizontal>
        <FormGroup
          label={t("allowKerberosAuthentication")}
          labelIcon={
            <HelpItem
              helpText={t("allowKerberosAuthenticationHelp")}
              fieldLabelId="allowKerberosAuthentication"
            />
          }
          fieldId="kc-allow-kerberos-authentication"
          hasNoPaddingTop
        >
          <Controller
            name="config.allowKerberosAuthentication"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id="kc-allow-kerberos-authentication"
                data-testid="allow-kerberos-auth"
                isDisabled={false}
                onChange={(_event, value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("on")}
                labelOff={t("off")}
                aria-label={t("allowKerberosAuthentication")}
              />
            )}
          ></Controller>
        </FormGroup>

        {allowKerberosAuth[0] === "true" && (
          <>
            <TextControl
              name="config.kerberosRealm.0"
              label={t("kerberosRealm")}
              labelIcon={t("kerberosRealmHelp")}
              rules={{
                required: t("validateRealm"),
              }}
            />
            <TextControl
              name="config.serverPrincipal.0"
              label={t("serverPrincipal")}
              labelIcon={t("serverPrincipalHelp")}
              rules={{
                required: t("validateServerPrincipal"),
              }}
            />
            <TextControl
              name="config.keyTab.0"
              label={t("keyTab")}
              labelIcon={t("keyTabHelp")}
              rules={{
                required: t("validateKeyTab"),
              }}
            />
            <TextControl
              name="config.krbPrincipalAttribute.0"
              label={t("krbPrincipalAttribute")}
              labelIcon={t("krbPrincipalAttributeHelp")}
            />

            <FormGroup
              label={t("debug")}
              labelIcon={
                <HelpItem helpText={t("debugHelp")} fieldLabelId="debug" />
              }
              fieldId="kc-debug"
              hasNoPaddingTop
            >
              <Controller
                name="config.debug"
                defaultValue={["false"]}
                control={form.control}
                render={({ field }) => (
                  <Switch
                    id="kc-debug"
                    data-testid="debug"
                    isDisabled={false}
                    onChange={(_event, value) => field.onChange([`${value}`])}
                    isChecked={field.value[0] === "true"}
                    label={t("on")}
                    labelOff={t("off")}
                    aria-label={t("debug")}
                  />
                )}
              />
            </FormGroup>
          </>
        )}
        <FormGroup
          label={t("useKerberosForPasswordAuthentication")}
          labelIcon={
            <HelpItem
              helpText={t("useKerberosForPasswordAuthenticationHelp")}
              fieldLabelId="useKerberosForPasswordAuthentication"
            />
          }
          fieldId="kc-use-kerberos-password-authentication"
          hasNoPaddingTop
        >
          <Controller
            name="config.useKerberosForPasswordAuthentication"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id="kc-use-kerberos-password-authentication"
                data-testid="use-kerberos-pw-auth"
                isDisabled={false}
                onChange={(_event, value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("on")}
                labelOff={t("off")}
                aria-label={t("useKerberosForPasswordAuthentication")}
              />
            )}
          ></Controller>
        </FormGroup>
      </FormAccess>
    </FormProvider>
  );
};
