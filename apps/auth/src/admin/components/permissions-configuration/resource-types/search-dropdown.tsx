/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/resource-types/SearchDropdown.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { SelectControl, TextControl } from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useToggle from "../../../utils/use-toggle";
import { ResourceType } from "./resource-type";


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
  resources?: string;
  scope?: string;
  type?: string;
  uri?: string;
  owner?: string;
  resourceType?: string;
};

type SearchDropdownProps = {
  resources?: UserRepresentation[];
  types: PolicyRepresentation[];
  search: SearchForm;
  onSearch: (form: SearchForm) => void;
  resourceType?: string;
};

export const SearchDropdown = ({
  types,
  search,
  onSearch,
}: SearchDropdownProps) => {
  const { t } = useTranslation();
  const form = useForm<SearchForm>({
    mode: "onChange",
    defaultValues: search,
  });

  const {
    reset,
    formState: { isDirty },
    handleSubmit,
  } = form;

  const [open, toggle] = useToggle();
  const [resourceScopes, setResourceScopes] = useState<string[]>([]);
  const selectedType = useWatch({
    control: form.control,
    name: "resourceType",
    defaultValue: "",
  });
  const [key, setKey] = useState(0);
  const ref = useRef("clients");

  const submit = (form: SearchForm) => {
    toggle();
    onSearch(form);
  };

  useEffect(() => {
    const type = types?.find((item) => item.type === selectedType);
    setResourceScopes(type?.scopes || []);
  }, [selectedType, types]);

  useEffect(() => {
    reset(search);
    setKey((prevKey) => prevKey + 1);
  }, [search]);

  return (
    <Dropdown
      toggle={(ref) => (
        <MenuToggle
          data-testid="searchdropdown_dorpdown"
          ref={ref}
          onClick={toggle}
          className="keycloak__client_authentication__searchdropdown"
        >
          {t("searchClientAuthorizationPermission")}
        </MenuToggle>
      )}
      isOpen={open}
    >
      <FormProvider {...form}>
        <Form
          key={key}
          isHorizontal
          className="keycloak__client_authentication__searchdropdown_form"
          onSubmit={handleSubmit(submit)}
        >
          <TextControl name="name" label={t("name")} />
          <SelectControl
            name="resourceType"
            label={t("type")}
            controller={{
              defaultValue: "",
            }}
            options={[
              { key: "", value: t("choose") },
              ...types.map(({ type, name }) => ({
                key: type!,
                value: name! || type!,
              })),
            ]}
            onSelect={(value, onChange) => {
              if (ref.current !== value) {
                ref.current = value as string;
                form.setValue("resources", undefined);
              }
              onChange(value);
            }}
          />
          {selectedType !== "" && (
            <>
              <ResourceType
                resourceType={selectedType || "clients"}
                withEnforceAccessTo={false}
              />
              <SelectControl
                name={"scope"}
                label={t("authorizationScope")}
                controller={{
                  defaultValue: "",
                }}
                options={[
                  ...(resourceScopes || []).map((resourceScope) => ({
                    key: resourceScope!,
                    value: resourceScope!,
                  })),
                ]}
              />
            </>
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
                reset({});
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
