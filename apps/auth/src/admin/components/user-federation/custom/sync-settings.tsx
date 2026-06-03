/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/custom/SyncSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelpItem, TextControl } from "../../../../shared/keycloak-ui-shared";


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

export const SyncSettings = () => {
  const { t } = useTranslation();
  const form = useFormContext();
  const { control, watch } = form;
  const watchPeriodicSync = watch("config.fullSyncPeriod", "-1");
  const watchChangedSync = watch("config.changedSyncPeriod", "-1");

  return (
    <FormProvider {...form}>
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
          name="config.fullSyncPeriod"
          defaultValue="-1"
          control={control}
          render={({ field }) => (
            <Switch
              id="kc-periodic-full-sync"
              data-testid="periodic-full-sync"
              onChange={(_event, value) => {
                field.onChange(value ? "604800" : "-1");
              }}
              isChecked={field.value !== "-1"}
              label={t("on")}
              labelOff={t("off")}
              aria-label={t("periodicFullSync")}
            />
          )}
        />
      </FormGroup>
      {watchPeriodicSync !== "-1" && (
        <TextControl
          name="config.fullSyncPeriod"
          label={t("fullSyncPeriod")}
          labelIcon={t("fullSyncPeriodHelp")}
          type="number"
          min={-1}
          defaultValue="604800"
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
          name="config.changedSyncPeriod"
          defaultValue="-1"
          control={control}
          render={({ field }) => (
            <Switch
              id="kc-periodic-changed-users-sync"
              data-testid="periodic-changed-users-sync"
              onChange={(_event, value) => {
                field.onChange(value ? "86400" : "-1");
              }}
              isChecked={field.value !== "-1"}
              label={t("on")}
              labelOff={t("off")}
              aria-label={t("periodicChangedUsersSync")}
            />
          )}
        />
      </FormGroup>
      {watchChangedSync !== "-1" && (
        <TextControl
          name="config.changedSyncPeriod"
          label={t("changedUsersSyncPeriod")}
          labelIcon={t("changedUsersSyncHelp")}
          type="number"
          min={-1}
          defaultValue="86400"
        />
      )}
    </FormProvider>
  );
};
