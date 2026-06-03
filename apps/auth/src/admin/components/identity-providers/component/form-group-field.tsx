/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/component/FormGroupField.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@metronome/ui/lib/utils";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

import { HelpItem } from "../../../../shared/keycloak-ui-shared";


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

export type FieldProps = { label: string; field: string; isReadOnly?: boolean };
export type FormGroupFieldProps = { label: string };

export const FormGroupField = ({
  label,
  children,
}: PropsWithChildren<FormGroupFieldProps>) => {
  const { t } = useTranslation();
  return (
    <FormGroup
      label={t(label)}
      fieldId={label}
      labelIcon={<HelpItem helpText={t(`${label}Help`)} fieldLabelId={label} />}
    >
      {children}
    </FormGroup>
  );
};
