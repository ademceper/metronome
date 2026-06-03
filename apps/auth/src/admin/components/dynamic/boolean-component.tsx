/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/BooleanComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { HelpItem } from "../../../shared/keycloak-ui-shared";
import type { ComponentProps } from "./components";


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

export const BooleanComponent = ({
  name,
  label,
  helpText,
  isDisabled = false,
  defaultValue,
  isNew = true,
  convertToName,
}: ComponentProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormGroup
      hasNoPaddingTop
      label={t(label!)}
      fieldId={name!}
      labelIcon={<HelpItem helpText={t(helpText!)} fieldLabelId={`${label}`} />}
    >
      <Controller
        name={convertToName(name!)}
        data-testid={name}
        defaultValue={isNew ? defaultValue : false}
        control={control}
        render={({ field }) => (
          <Switch
            id={name!}
            isDisabled={isDisabled}
            label={t("on")}
            labelOff={t("off")}
            isChecked={
              field.value === "true" ||
              field.value === true ||
              field.value?.[0] === "true"
            }
            onChange={(_event, value) => field.onChange("" + value)}
            data-testid={name}
            aria-label={t(label!)}
          />
        )}
      />
    </FormGroup>
  );
};
