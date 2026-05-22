/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/TextControl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@metronome/ui/components/form";
import { Input } from "@metronome/ui/components/input";
import type { ReactNode } from "react";
import {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
} from "react-hook-form";
import { getRuleValue } from "../utils/getRuleValue";

export type TextControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, P> & {
  label: string;
  labelIcon?: string | ReactNode;
  isDisabled?: boolean;
  helperText?: string;
  type?: string;
  placeholder?: string;
  "data-testid"?: string;
};

export const TextControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(
  props: TextControlProps<T, P>,
) => {
  const required = !!getRuleValue(props.rules?.required);
  const defaultValue = props.defaultValue ?? ("" as PathValue<T, P>);

  const floatingLabel: ReactNode = (
    <>
      {props.label}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </>
  );

  return (
    <FormField
      control={props.control}
      name={props.name}
      rules={props.rules}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <Input
              variant="floating"
              label={floatingLabel}
              id={props.name}
              data-testid={props["data-testid"] || props.name}
              type={props.type || "text"}
              placeholder={props.placeholder}
              disabled={props.isDisabled}
              required={required}
              {...field}
            />
          </FormControl>
          {props.helperText && !fieldState.error && (
            <FormDescription>{props.helperText}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
