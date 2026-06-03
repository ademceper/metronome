/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/form/FixedButtonGroup.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";

const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
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
type ActionGroupProps = React.ComponentProps<typeof ActionGroup>;

type FixedButtonGroupProps = ActionGroupProps & {
  name: string;
  save?: () => void;
  saveText?: string;
  reset?: () => void;
  resetText?: string;
  isSubmit?: boolean;
  isDisabled?: boolean;
};

export const FixedButtonsGroup = ({
  name,
  save,
  saveText,
  reset,
  resetText,
  isSubmit = false,
  isDisabled = false,
  children,
  ...rest
}: FixedButtonGroupProps) => {
  const { t } = useTranslation();
  return (
    <ActionGroup className={""} {...rest}>
      {(save || isSubmit) && (
        <Button
          isDisabled={isDisabled}
          data-testid={`${name}-save`}
          onClick={() => save?.()}
          type={isSubmit ? "submit" : "button"}
        >
          {!saveText ? t("save") : saveText}
        </Button>
      )}
      {reset && (
        <Button
          isDisabled={isDisabled}
          data-testid={`${name}-revert`}
          variant="link"
          onClick={() => reset()}
        >
          {!resetText ? t("revert") : resetText}
        </Button>
      )}
      {children}
    </ActionGroup>
  );
};
