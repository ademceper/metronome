/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/PasswordInput.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { Eye as EyeIcon, EyeSlash as EyeSlashIcon } from "@phosphor-icons/react"
import { MutableRefObject, Ref, forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";


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
const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);
type TextInputProps = React.ComponentProps<typeof TextInput>;

export type PasswordInputProps = TextInputProps & {
  hasReveal?: boolean;
};

const PasswordInputBase = ({
  hasReveal = true,
  innerRef,
  ...rest
}: PasswordInputProps) => {
  const { t } = useTranslation();
  const [hidePassword, setHidePassword] = useState(true);
  return (
    <InputGroup>
      <InputGroupItem isFill>
        <TextInput
          {...rest}
          type={hidePassword ? "password" : "text"}
          ref={innerRef}
        />
      </InputGroupItem>
      {hasReveal && (
        <Button
          variant="control"
          aria-label={t("showPassword")}
          onClick={() => setHidePassword(!hidePassword)}
        >
          {hidePassword ? <EyeIcon /> : <EyeSlashIcon />}
        </Button>
      )}
    </InputGroup>
  );
};

export const PasswordInput = forwardRef(
  (props: PasswordInputProps, ref: Ref<HTMLInputElement>) => (
    <PasswordInputBase {...props} innerRef={ref as MutableRefObject<any>} />
  ),
);
PasswordInput.displayName = "PasswordInput";
