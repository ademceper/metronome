/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/FormLabel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { cn } from "@metronome/ui/lib/utils";
import { PropsWithChildren, ReactNode } from "react";
import { FieldError, FieldValues, Merge } from "react-hook-form";
import { FormErrorText } from "./FormErrorText";
import { HelpItem } from "./HelpItem";


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
type FormGroupProps = React.ComponentProps<typeof FormGroup>;

export type FieldProps<T extends FieldValues = FieldValues> = {
  id?: string | undefined;
  label?: string;
  name: string;
  labelIcon?: string | ReactNode;
  error?: FieldError | Merge<FieldError, T>;
  isRequired: boolean;
};

type FormLabelProps = FieldProps & Omit<FormGroupProps, "label" | "labelIcon">;

export const FormLabel = ({
  id,
  name,
  label,
  labelIcon,
  error,
  children,
  ...rest
}: PropsWithChildren<FormLabelProps>) => (
  <FormGroup
    label={label || name}
    fieldId={id || name}
    labelIcon={
      labelIcon ? (
        <HelpItem helpText={labelIcon} fieldLabelId={id || name} />
      ) : undefined
    }
    {...rest}
  >
    {children}
    {error && (
      <FormErrorText data-testid={`${name}-helper`} message={error.message} />
    )}
  </FormGroup>
);
