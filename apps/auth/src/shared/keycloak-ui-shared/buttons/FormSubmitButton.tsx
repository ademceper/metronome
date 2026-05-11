/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/buttons/FormSubmitButton.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { PropsWithChildren } from "react";
import { FieldValues, FormState } from "react-hook-form";


const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;
const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};
type ButtonProps = React.ComponentProps<typeof Button>;

export type FormSubmitButtonProps = Omit<ButtonProps, "isDisabled"> & {
  formState: FormState<FieldValues>;
  allowNonDirty?: boolean;
  allowInvalid?: boolean;
  isDisabled?: boolean;
};

const isSubmittable = (
  formState: FormState<FieldValues>,
  allowNonDirty: boolean,
  allowInvalid: boolean,
) => {
  return (
    (formState.isValid || allowInvalid) &&
    (formState.isDirty || allowNonDirty) &&
    !formState.isLoading &&
    !formState.isValidating &&
    !formState.isSubmitting
  );
};

export const FormSubmitButton = ({
  formState,
  isDisabled = false,
  allowInvalid = false,
  allowNonDirty = false,
  children,
  ...rest
}: PropsWithChildren<FormSubmitButtonProps>) => {
  return (
    <Button
      variant="primary"
      isDisabled={
        (formState && !isSubmittable(formState, allowNonDirty, allowInvalid)) ||
        isDisabled
      }
      {...rest}
      type="submit"
    >
      {children}
    </Button>
  );
};
