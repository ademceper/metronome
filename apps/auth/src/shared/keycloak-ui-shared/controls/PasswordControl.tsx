/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/PasswordControl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@metronome/ui/lib/utils";
import {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { getRuleValue } from "../utils/getRuleValue";
import { FormLabel } from "./FormLabel";
import { PasswordInput, PasswordInputProps } from "./PasswordInput";


const FormHelperText = ({ children, className, ...props }: any) => (
  <div className={cn("text-muted-foreground text-xs", className)} {...props}>{children}</div>
);
const HelperText = ({ children, className, ...props }: any) => (
  <div className={cn("text-sm text-muted-foreground", className)} {...props}>{children}</div>
);
const HelperTextItem = ({ icon, variant, children, ...props }: any) => (
  <p className={cn("text-sm",
    variant === "error" ? "text-destructive" : variant === "warning" ? "text-amber-600" : "text-muted-foreground",
    (props as any).className)} {...props}>
    {icon}{children}
  </p>
);
const ValidatedOptions = {
  default: "default",
  success: "success",
  warning: "warning",
  error: "error",
} as const;

export type PasswordControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, P> &
  Omit<PasswordInputProps, "name" | "isRequired" | "required"> & {
    label: string;
    labelIcon?: string;
    isDisabled?: boolean;
    helperText?: string;
  };

export const PasswordControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(
  props: PasswordControlProps<T, P>,
) => {
  const { labelIcon, ...rest } = props;
  const required = !!getRuleValue(props.rules?.required);
  const defaultValue = props.defaultValue ?? ("" as PathValue<T, P>);

  const { field, fieldState } = useController({
    ...props,
    defaultValue,
  });

  return (
    <FormLabel
      name={props.name}
      label={props.label}
      labelIcon={labelIcon}
      isRequired={required}
      error={fieldState.error}
    >
      <PasswordInput
        isRequired={required}
        id={props.name}
        data-testid={props.name}
        validated={
          fieldState.error ? ValidatedOptions.error : ValidatedOptions.default
        }
        isDisabled={props.isDisabled}
        {...rest}
        {...field}
      />
      {props.helperText && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{props.helperText}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormLabel>
  );
};
