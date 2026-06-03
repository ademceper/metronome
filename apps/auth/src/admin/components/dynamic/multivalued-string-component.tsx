/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/MultivaluedStringComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { HelpItem } from "../../../shared/keycloak-ui-shared";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { MultiLineInput } from "../multi-line-input/multi-line-input";
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

function convertDefaultValue(formValue?: any): string[] {
  return formValue && Array.isArray(formValue) ? formValue : [formValue];
}

export const MultiValuedStringComponent = ({
  name,
  label,
  defaultValue,
  helpText,
  stringify,
  required,
  isDisabled = false,
  convertToName,
}: ComponentProps) => {
  const { t } = useTranslation();
  const fieldName = convertToName(name!);

  return (
    <FormGroup
      label={t(label!)}
      labelIcon={<HelpItem helpText={t(helpText!)} fieldLabelId={`${label}`} />}
      fieldId={name!}
      isRequired={required}
    >
      <MultiLineInput
        aria-label={t(label!)}
        name={fieldName}
        isDisabled={isDisabled}
        isRequired={required}
        defaultValue={convertDefaultValue(defaultValue)}
        addButtonLabel={t("addMultivaluedLabel", {
          fieldLabel: t(label!).toLowerCase(),
        })}
        stringify={stringify}
      />
    </FormGroup>
  );
};
