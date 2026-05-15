/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/SearchDropdown.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type PolicyProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyProviderRepresentation";
import { SelectControl, TextControl } from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useToggle from "../../../utils/useToggle";

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
const Dropdown = ({ toggle, isOpen, onSelect, onOpenChange, popperProps, children, ...props }: any) => {
  const trigger = typeof toggle === "function" ? toggle((node: HTMLElement | null) => node) : toggle;
  return (
    <UIDropdownMenu open={isOpen} onOpenChange={(open: boolean) => onOpenChange?.(open)}>
      <UIDropdownMenuTrigger asChild>{trigger}</UIDropdownMenuTrigger>
      <UIDropdownMenuContent>{children}</UIDropdownMenuContent>
    </UIDropdownMenu>
  );
};
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";

export type SearchForm = {
  name?: string;
  resource?: string;
  scope?: string;
  type?: string;
  uri?: string;
  owner?: string;
};

type SearchDropdownProps = {
  types?: PolicyProviderRepresentation[] | PolicyProviderRepresentation[];
  search: SearchForm;
  onSearch: (form: SearchForm) => void;
  type: "resource" | "policy" | "permission";
};

const defaultValues: SearchForm = {
  name: "",
  type: "",
  uri: "",
  owner: "",
  scope: "",
  resource: "",
};

export const SearchDropdown = ({
  types,
  search,
  onSearch,
  type,
}: SearchDropdownProps) => {
  const { t } = useTranslation();
  const form = useForm<SearchForm>({ mode: "onChange", defaultValues });
  const {
    reset,
    formState: { isDirty },
    handleSubmit,
  } = form;

  const [open, toggle] = useToggle();

  const submit = (form: SearchForm) => {
    toggle();
    onSearch(form);
  };

  useEffect(() => reset(search), [search, reset]);

  return (
    <Dropdown
      onOpenChange={toggle}
      toggle={(ref) => (
        <MenuToggle
          data-testid="searchdropdown_dorpdown"
          ref={ref}
          onClick={toggle}
          className="keycloak__client_authentication__searchdropdown"
        >
          {type === "resource" && t("searchClientAuthorizationResource")}
          {type === "policy" && t("searchClientAuthorizationPolicy")}
          {type === "permission" && t("searchClientAuthorizationPermission")}
        </MenuToggle>
      )}
      isOpen={open}
    >
      <FormProvider {...form}>
        <Form
          isHorizontal
          className="keycloak__client_authentication__searchdropdown_form"
          onSubmit={handleSubmit(submit)}
        >
          <TextControl name="name" label={t("name")} />
          {type === "resource" && (
            <>
              <TextControl name="type" label={t("type")} />
              <TextControl name="uri" label={t("uris")} />
              <TextControl name="owner" label={t("owner")} />
            </>
          )}
          {type !== "resource" && type !== "policy" && (
            <TextControl name="resource" label={t("resource")} />
          )}
          {type !== "policy" && <TextControl name="scope" label={t("scope")} />}
          {type !== "resource" && (
            <SelectControl
              name="type"
              label={t("type")}
              controller={{
                defaultValue: "",
              }}
              options={[
                { key: "", value: t("allTypes") },
                ...(types || []).map(({ type, name }) => ({
                  key: type!,
                  value: name!,
                })),
              ]}
            />
          )}
          <ActionGroup>
            <Button
              variant="primary"
              type="submit"
              data-testid="search-btn"
              isDisabled={!isDirty}
            >
              {t("search")}
            </Button>
            <Button
              variant="link"
              data-testid="revert-btn"
              onClick={() => {
                reset(defaultValues);
                onSearch({});
              }}
            >
              {t("clear")}
            </Button>
          </ActionGroup>
        </Form>
      </FormProvider>
    </Dropdown>
  );
};
