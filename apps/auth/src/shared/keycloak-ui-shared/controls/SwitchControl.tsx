/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/SwitchControl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import {
  Controller,
  FieldValues,
  FieldPath,
  UseControllerProps,
  PathValue,
  useFormContext,
} from "react-hook-form";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { FormLabel } from "./FormLabel";
import { debeerify } from "../user-profile/utils";


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
type SwitchProps = React.ComponentProps<typeof Switch>;

export type SwitchControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = Omit<SwitchProps, "name" | "defaultValue" | "ref"> &
  UseControllerProps<any, P> & {
    name: string;
    label?: string;
    labelIcon?: string;
    labelOn: string;
    labelOff: string;
    stringify?: boolean;
  };

export const SwitchControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  labelOn,
  stringify,
  defaultValue,
  labelIcon,
  ...props
}: SwitchControlProps<T, P>) => {
  const fallbackValue = stringify ? "false" : false;
  const defValue = defaultValue ?? (fallbackValue as PathValue<T, P>);
  const { control } = useFormContext();
  return (
    <FormLabel
      hasNoPaddingTop
      name={props.name}
      isRequired={props.rules?.required === true}
      label={props.label}
      labelIcon={labelIcon}
    >
      <Controller
        control={control}
        name={props.name}
        defaultValue={defValue}
        render={({ field: { onChange, value } }) => (
          <Switch
            {...props}
            id={props.name}
            data-testid={debeerify(props.name)}
            label={labelOn}
            aria-label={props.label}
            isChecked={stringify ? value === "true" : value}
            onChange={(e, checked) => {
              const value = stringify ? checked.toString() : checked;
              props.onChange?.(e, checked);
              onChange(value);
            }}
          />
        )}
      />
    </FormLabel>
  );
};
