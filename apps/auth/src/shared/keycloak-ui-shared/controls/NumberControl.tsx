/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/NumberControl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Input as UIInput } from "@metronome/ui/components/input";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";

import { getRuleValue } from "../utils/getRuleValue";
import { FormLabel } from "./FormLabel";


const NumberInput = ({ value, onChange, min, max, step, ...props }: any) => (
  <UIInput type="number" value={value ?? ""}
    onChange={(e: any) => onChange?.(e)} min={min} max={max} step={step} {...props} />
);
const ValidatedOptions = {
  default: "default",
  success: "success",
  warning: "warning",
  error: "error",
} as const;
type NumberInputProps = React.ComponentProps<typeof NumberInput>;

export type NumberControlOption = {
  key: string;
  value: string;
};

export type NumberControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = Omit<NumberInputProps, "name" | "isRequired" | "required"> &
  UseControllerProps<T, P> & {
    name: string;
    label?: string;
    labelIcon?: string;
    controller: Omit<ControllerProps, "name" | "render">;
  };

export const NumberControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  name,
  label,
  controller,
  labelIcon,
  ...rest
}: NumberControlProps<T, P>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormLabel
      name={name}
      label={label}
      isRequired={controller.rules?.required === true}
      error={errors[name]}
      labelIcon={labelIcon}
    >
      <Controller
        {...controller}
        name={name}
        control={control}
        render={({ field }) => {
          const required = !!controller.rules?.required;
          const min = getRuleValue(controller.rules?.min);
          const value = field.value ?? controller.defaultValue;
          const setValue = (newValue: number) =>
            field.onChange(
              min !== undefined ? Math.max(newValue, Number(min)) : newValue,
            );

          return (
            <NumberInput
              {...rest}
              id={name}
              value={value}
              validated={
                errors[name] ? ValidatedOptions.error : ValidatedOptions.default
              }
              required={required}
              min={Number(min)}
              max={Number(controller.rules?.max)}
              onPlus={() => setValue(value + 1)}
              onMinus={() => setValue(value - 1)}
              onChange={(event) => {
                const newValue = Number(event.currentTarget.value);
                setValue(!isNaN(newValue) ? newValue : controller.defaultValue);
              }}
            />
          );
        }}
      />
    </FormLabel>
  );
};
