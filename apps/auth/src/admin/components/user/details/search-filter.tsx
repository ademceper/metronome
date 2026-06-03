/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/details/SearchFilter.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { KeycloakSelect } from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { Funnel as FilterIcon } from "@phosphor-icons/react"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectOption } from "../../../../shared/pf-compat"


const Dropdown = ({ toggle, isOpen, onSelect, onOpenChange, popperProps, children, ...props }: any) => {
  const trigger = typeof toggle === "function" ? toggle((node: HTMLElement | null) => node) : toggle;
  return (
    <UIDropdownMenu open={isOpen} onOpenChange={(open: boolean) => onOpenChange?.(open)}>
      <UIDropdownMenuTrigger asChild>{trigger}</UIDropdownMenuTrigger>
      <UIDropdownMenuContent>{children}</UIDropdownMenuContent>
    </UIDropdownMenu>
  );
};
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const DropdownList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

export type SearchType = "default" | "attribute";

type SearchToolbarProps = SearchDropdownProps;

type SearchDropdownProps = {
  searchType: SearchType;
  onSelect: (value: SearchType) => void;
};

export const SearchDropdown = ({
  searchType,
  onSelect,
}: SearchDropdownProps) => {
  const { t } = useTranslation();
  const [searchToggle, setSearchToggle] = useState(false);

  const createDropdown = (searchType: SearchType) => (
    <DropdownItem
      key={searchType}
      onClick={() => {
        onSelect(searchType);
        setSearchToggle(false);
      }}
    >
      {t(`searchType.${searchType}`)}
    </DropdownItem>
  );
  const options = [createDropdown("default"), createDropdown("attribute")];

  return (
    <Dropdown
      className="keycloak__users__searchtype"
      onOpenChange={(isOpen) => setSearchToggle(isOpen)}
      toggle={(ref) => (
        <MenuToggle
          data-testid="user-search-toggle"
          ref={ref}
          id="toggle-id"
          onClick={() => setSearchToggle(!searchToggle)}
          icon={<FilterIcon />}
        >
          {t(`searchType.${searchType}`)}
        </MenuToggle>
      )}
      isOpen={searchToggle}
    >
      <DropdownList>{options}</DropdownList>
    </Dropdown>
  );
};

export const SearchToolbar = ({ searchType, onSelect }: SearchToolbarProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <ToolbarItem>
        <SearchDropdown searchType={searchType} onSelect={onSelect} />
      </ToolbarItem>
      <ToolbarItem>
        <KeycloakSelect
          className="keycloak__users__searchtype"
          onToggle={(val) => setOpen(val)}
          isOpen={open}
          selections={[t("default"), t("attribute")]}
          onSelect={() => setOpen(false)}
        >
          <SelectOption value={"default"}>{t("default")}</SelectOption>
          <SelectOption value={"attribute"}>{t("attribute")}</SelectOption>
        </KeycloakSelect>
      </ToolbarItem>
    </>
  );
};
