/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/SearchInputComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { ArrowRight as ArrowRightIcon, MagnifyingGlass as SearchIcon, X as TimesIcon } from "@phosphor-icons/react"
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
const TextInputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const TextInputGroupMain = ({ children, ...props }: any) => (
  <div className="flex-1" {...props}>{children}</div>
);
const TextInputGroupUtilities = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>{children}</div>
);

type SearchInputComponentProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  "aria-label"?: string;
};

export const SearchInputComponent = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder,
  "aria-label": ariaLabel,
}: SearchInputComponentProps) => {
  const { t } = useTranslation();

  return (
    <>
      <TextInputGroup>
        <TextInputGroupMain
          icon={<SearchIcon />}
          value={value}
          onChange={(event: React.FormEvent<HTMLInputElement>) =>
            onChange(event.currentTarget.value)
          }
          placeholder={placeholder}
          aria-label={ariaLabel}
          data-testid="search-input"
        />
        <TextInputGroupUtilities style={{ marginInline: "0px" }}>
          {value && (
            <Button
              variant="plain"
              onClick={onClear}
              aria-label={t("clear")}
              data-testid="clear-search"
              icon={<TimesIcon />}
            />
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
      <Button
        icon={<ArrowRightIcon />}
        variant="control"
        style={{ marginLeft: "0.1rem" }}
        onClick={() => onSearch(value)}
        aria-label={t("search")}
        data-testid="search"
      />
    </>
  );
};
