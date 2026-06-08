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
import { cn } from "@metronome/ui/lib/utils";
import { HelpItem } from "./HelpItem";
import { debeerify } from "../user-profile/utils";

type SwitchProps = React.ComponentProps<"input"> & {
  label?: React.ReactNode;
  labelOn?: React.ReactNode;
  labelOff?: React.ReactNode;
  isChecked?: boolean;
  onChange?: (event: unknown, checked: boolean) => void;
  isDisabled?: boolean;
};

export type SwitchControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = Omit<SwitchProps, "name" | "defaultValue" | "ref"> &
  UseControllerProps<any, P> & {
    name: string;
    label?: React.ReactNode;
    labelIcon?: string;
    labelOn?: React.ReactNode;
    labelOff?: React.ReactNode;
    stringify?: boolean;
    /** Set true to drop the bottom divider; otherwise rows separate naturally. */
    hideSeparator?: boolean;
  };

export const SwitchControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  stringify,
  defaultValue,
  labelIcon,
  hideSeparator,
  ...props
}: SwitchControlProps<T, P>) => {
  const fallbackValue = stringify ? "false" : false;
  const defValue = defaultValue ?? (fallbackValue as PathValue<T, P>);
  const { control, formState } = useFormContext();
  const error = formState.errors?.[props.name];
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-2",
        !hideSeparator && "border-b border-border/60 last:border-b-0"
      )}
    >
      <label
        htmlFor={props.name}
        className="flex min-w-0 cursor-pointer items-center gap-1.5 text-sm font-medium"
      >
        <span className="truncate">{props.label}</span>
        {props.rules?.required === true && (
          <span className="text-destructive">*</span>
        )}
        {labelIcon ? (
          <HelpItem helpText={labelIcon} fieldLabelId={props.name} />
        ) : null}
      </label>
      <Controller
        control={control}
        name={props.name}
        defaultValue={defValue}
        render={({ field: { onChange, value } }) => (
          <UISwitch
            id={props.name}
            data-testid={debeerify(props.name)}
            aria-label={typeof props.label === "string" ? props.label : props.name}
            checked={stringify ? value === "true" : value}
            disabled={props.isDisabled}
            onCheckedChange={(checked) => {
              const next = stringify ? checked.toString() : checked;
              props.onChange?.(undefined, checked);
              onChange(next);
            }}
          />
        )}
      />
      {error?.message ? (
        <p className="text-destructive text-xs">{String(error.message)}</p>
      ) : null}
    </div>
  );
};
