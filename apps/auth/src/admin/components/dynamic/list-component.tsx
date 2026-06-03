/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/ListComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  HelpItem,
  KeycloakSelect,
  SelectVariant,
} from "../../../shared/keycloak-ui-shared";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ComponentProps } from "./components";
import { SelectOption } from "../../../shared/pf-compat"


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

export const ListComponent = ({
  name,
  label,
  helpText,
  defaultValue,
  options,
  required,
  isDisabled = false,
  convertToName,
}: ComponentProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormGroup
      label={t(label!)}
      labelIcon={<HelpItem helpText={t(helpText!)} fieldLabelId={`${label}`} />}
      fieldId={name!}
      isRequired={required}
    >
      <Controller
        name={convertToName(name!)}
        data-testid={name}
        defaultValue={defaultValue || options?.[0] || ""}
        control={control}
        render={({ field }) => (
          <KeycloakSelect
            toggleId={name}
            isDisabled={isDisabled}
            onToggle={(toggle) => setOpen(toggle)}
            onSelect={(value) => {
              field.onChange(value as string);
              setOpen(false);
            }}
            selections={field.value}
            variant={SelectVariant.single}
            aria-label={t(label!)}
            isOpen={open}
          >
            {options?.map((option) => (
              <SelectOption
                selected={option === field.value}
                key={option}
                value={option}
              >
                {option}
              </SelectOption>
            ))}
          </KeycloakSelect>
        )}
      />
    </FormGroup>
  );
};
