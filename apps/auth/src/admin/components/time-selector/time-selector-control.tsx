/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/time-selector/TimeSelectorControl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@metronome/ui/lib/utils";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import { FormErrorText, HelpItem } from "../../../shared/keycloak-ui-shared";
import { TimeSelector, TimeSelectorProps } from "./time-selector";


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
const ValidatedOptions = {
  default: "default",
  success: "success",
  warning: "warning",
  error: "error",
} as const;

export type NumberControlOption = {
  key: string;
  value: string;
};

export type TimeSelectorControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = Omit<TimeSelectorProps, "name"> &
  UseControllerProps<T, P> & {
    name: string;
    label?: string;
    labelIcon?: string;
    controller: Omit<ControllerProps, "name" | "render">;
  };

export const TimeSelectorControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  name,
  label,
  controller,
  labelIcon,
  ...rest
}: TimeSelectorControlProps<T, P>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <FormGroup
      isRequired={controller.rules?.required === true}
      label={label || name}
      fieldId={name}
      labelIcon={
        labelIcon ? (
          <HelpItem helpText={labelIcon} fieldLabelId={name} />
        ) : undefined
      }
    >
      <Controller
        {...controller}
        name={name}
        control={control}
        render={({ field }) => (
          <TimeSelector
            {...rest}
            id={name}
            data-testid={name}
            value={field.value}
            onChange={field.onChange}
            validated={
              error ? ValidatedOptions.error : ValidatedOptions.default
            }
          />
        )}
      />
      {error && (
        <FormErrorText
          data-testid={`${name}-helper`}
          message={error.message as string}
        />
      )}
    </FormGroup>
  );
};
