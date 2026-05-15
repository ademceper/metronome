/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/ldap/LdapSettingsSynchronization.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { Controller, FormProvider, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelpItem, TextControl } from "../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../form/FormAccess";
import { WizardSectionHeader } from "../../wizard-section-header/WizardSectionHeader";


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

export type LdapSettingsSynchronizationProps = {
  form: UseFormReturn;
  showSectionHeading?: boolean;
  showSectionDescription?: boolean;
};

export const LdapSettingsSynchronization = ({
  form,
  showSectionHeading = false,
  showSectionDescription = false,
}: LdapSettingsSynchronizationProps) => {
  const { t } = useTranslation();

  const watchPeriodicSync = form.watch("config.periodicFullSync", false);
  const watchChangedSync = form.watch("config.periodicChangedUsersSync", false);

  return (
    <FormProvider {...form}>
      {showSectionHeading && (
        <WizardSectionHeader
          title={t("synchronizationSettings")}
          description={t("ldapSynchronizationSettingsDescription")}
          showDescription={showSectionDescription}
        />
      )}

      <FormAccess role="manage-realm" isHorizontal>
        <FormGroup
          hasNoPaddingTop
          label={t("importUsers")}
          labelIcon={
            <HelpItem
              helpText={t("importUsersHelp")}
              fieldLabelId="importUsers"
            />
          }
          fieldId="kc-import-users"
        >
          <Controller
            name="config.importEnabled"
            defaultValue={["true"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id="kc-import-users"
                data-testid="import-users"
                name="importEnabled"
                label={t("on")}
                labelOff={t("off")}
                onChange={(_event, value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                isDisabled={false}
                aria-label={t("importUsers")}
              />
            )}
          ></Controller>
        </FormGroup>
        <FormGroup
          hasNoPaddingTop
          label={t("syncRegistrations")}
          labelIcon={
            <HelpItem
              helpText={t("syncRegistrations")}
              fieldLabelId="syncRegistrations"
            />
          }
          fieldId="syncRegistrations"
        >
          <Controller
            name="config.syncRegistrations"
            defaultValue={["true"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id="syncRegistrations"
                data-testid="syncRegistrations"
                label={t("on")}
                labelOff={t("off")}
                onChange={(_event, value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                aria-label={t("syncRegistrations")}
              />
            )}
          />
        </FormGroup>
        <TextControl
          name="config.batchSizeForSync.0"
          type="number"
          min={0}
          label={t("batchSize")}
          labelIcon={t("batchSizeHelp")}
        />
        <FormGroup
          label={t("periodicFullSync")}
          labelIcon={
            <HelpItem
              helpText={t("periodicFullSyncHelp")}
              fieldLabelId="periodicFullSync"
            />
          }
          fieldId="kc-periodic-full-sync"
          hasNoPaddingTop
        >
          <Controller
            name="config.periodicFullSync"
            defaultValue={false}
            control={form.control}
            render={({ field }) => (
              <Switch
                id="kc-periodic-full-sync"
                data-testid="periodic-full-sync"
                isDisabled={false}
                onChange={(_event, value) => field.onChange(value)}
                isChecked={field.value === true}
                label={t("on")}
                labelOff={t("off")}
                aria-label={t("periodicFullSync")}
              />
            )}
          />
        </FormGroup>
        {watchPeriodicSync && (
          <TextControl
            name="config.fullSyncPeriod.0"
            label={t("fullSyncPeriod")}
            labelIcon={t("fullSyncPeriodHelp")}
            type="number"
            min={-1}
            defaultValue={604800}
          />
        )}
        <FormGroup
          label={t("periodicChangedUsersSync")}
          labelIcon={
            <HelpItem
              helpText={t("periodicChangedUsersSyncHelp")}
              fieldLabelId="periodicChangedUsersSync"
            />
          }
          fieldId="kc-periodic-changed-users-sync"
          hasNoPaddingTop
        >
          <Controller
            name="config.periodicChangedUsersSync"
            defaultValue={false}
            control={form.control}
            render={({ field }) => (
              <Switch
                id="kc-periodic-changed-users-sync"
                data-testid="periodic-changed-users-sync"
                isDisabled={false}
                onChange={(_event, value) => field.onChange(value)}
                isChecked={field.value === true}
                label={t("on")}
                labelOff={t("off")}
                aria-label={t("periodicChangedUsersSync")}
              />
            )}
          />
        </FormGroup>
        {watchChangedSync && (
          <TextControl
            name="config.changedSyncPeriod.0"
            label={t("changedUsersSyncPeriod")}
            labelIcon={t("changedUsersSyncHelp")}
            type="number"
            min={-1}
            defaultValue={86400}
          />
        )}
        <FormGroup
          label={t("removeInvalidUsers")}
          labelIcon={
            <HelpItem
              helpText={t("removeInvalidUsersHelp")}
              fieldLabelId="removeInvalidUsers"
            />
          }
          fieldId="kc-remove-invalid-users"
          hasNoPaddingTop
        >
          <Controller
            name="config.removeInvalidUsersEnabled"
            defaultValue={["true"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id="kc-remove-invalid-users"
                data-testid="remove-invalid-users"
                isDisabled={false}
                onChange={(_event, value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("on")}
                labelOff={t("off")}
                aria-label={t("removeInvalidUsers")}
              />
            )}
          />
        </FormGroup>
      </FormAccess>
    </FormProvider>
  );
};
