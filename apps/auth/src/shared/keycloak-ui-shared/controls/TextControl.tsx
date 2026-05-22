/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/TextControl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Input } from "@metronome/ui/components/input";
import type { ReactNode } from "react";
import {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
  useController,
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
  "data-testid"?: string;
  placeholder?: string;
};

export const TextControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(
  props: TextControlProps<T, P>,
) => {
  const required = !!getRuleValue(props.rules?.required);
  const defaultValue = props.defaultValue ?? ("" as PathValue<T, P>);

  const { field, fieldState } = useController({
    ...props,
    defaultValue,
  });

  const floatingLabel: ReactNode = (
    <>
      {props.label}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </>
  );

  const errorMessage = fieldState.error?.message as string | undefined;

  return (
    <div className="space-y-1.5">
      <Input
        variant="floating"
        label={floatingLabel}
        id={props.name}
        data-testid={props["data-testid"] || props.name}
        type={props.type || "text"}
        placeholder={props.placeholder}
        disabled={props.isDisabled}
        required={required}
        aria-invalid={!!fieldState.error}
        {...field}
      />
      {props.helperText && !errorMessage && (
        <p className="text-muted-foreground text-xs">{props.helperText}</p>
      )}
      <div
        data-visible={!!errorMessage}
        aria-hidden={!errorMessage}
        className="-mt-1.5 grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,margin-top] duration-200 ease-out data-[visible=true]:mt-0 data-[visible=true]:grid-rows-[1fr] data-[visible=true]:opacity-100"
      >
        <div className="overflow-hidden">
          <p
            data-testid={`${props.name}-helper`}
            className="text-destructive text-sm"
            aria-live="polite"
          >
            {errorMessage}
          </p>
        </div>
      </div>
    </div>
  );
};
