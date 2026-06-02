/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/users/UserDataTableToolbarItems.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import type { UserProfileConfig } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { ArrowRight as ArrowRightIcon, DotsThreeVertical as EllipsisVIcon } from "@phosphor-icons/react"
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAccess } from "../../context/access/access";
import { SearchDropdown, SearchType } from "../user/details/SearchFilter";
import DropdownPanel from "../dropdown-panel/DropdownPanel";
import { UserFilter } from "./UserDataTable";
import { UserDataTableAttributeSearchForm } from "./UserDataTableAttributeSearchForm";


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
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const DropdownList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const SearchInput = ({ value, onChange, onClear, onSearch, placeholder, ...props }: any) => (
  <UIInput type="search" value={value ?? ""} placeholder={placeholder}
    onChange={(e: any) => onChange?.(e.target.value, e)} {...props} />
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

type UserDataTableToolbarItemsProps = {
  searchDropdownOpen: boolean;
  setSearchDropdownOpen: (open: boolean) => void;
  realm: RealmRepresentation;
  hasSelectedRows: boolean;
  toggleDeleteDialog: () => void;
  toggleUnlockUsersDialog: () => void;
  goToCreate: () => void;
  searchType: SearchType;
  setSearchType: (searchType: SearchType) => void;
  searchUser: string;
  setSearchUser: (searchUser: string) => void;
  activeFilters: UserFilter;
  setActiveFilters: (activeFilters: UserFilter) => void;
  refresh: () => void;
  profile: UserProfileConfig;
  clearAllFilters: () => void;
  createAttributeSearchChips: () => ReactNode;
  searchUserWithAttributes: () => void;
};

export function UserDataTableToolbarItems({
  searchDropdownOpen,
  setSearchDropdownOpen,
  realm,
  hasSelectedRows,
  toggleDeleteDialog,
  toggleUnlockUsersDialog,
  goToCreate,
  searchType,
  setSearchType,
  searchUser,
  setSearchUser,
  activeFilters,
  setActiveFilters,
  refresh,
  profile,
  clearAllFilters,
  createAttributeSearchChips,
  searchUserWithAttributes,
}: UserDataTableToolbarItemsProps) {
  const { t } = useTranslation();
  const [kebabOpen, setKebabOpen] = useState(false);

  const { hasAccess } = useAccess();

  // Only needs query-users access to attempt add/delete of users.
  // This is because the user could have fine-grained access to users
  // of a group.  There is no way to know this without searching the
  // permissions of every group.
  const isManager = hasAccess("query-users");

  const searchItem = () => {
    return (
      <ToolbarItem>
        <InputGroup>
          <InputGroupItem>
            <SearchDropdown
              searchType={searchType}
              onSelect={(searchType) => {
                clearAllFilters();
                setSearchType(searchType);
              }}
            />
          </InputGroupItem>
          {searchType === "default" && defaultSearchInput()}
          {searchType === "attribute" && attributeSearchInput()}
        </InputGroup>
      </ToolbarItem>
    );
  };

  const defaultSearchInput = () => {
    return (
      <ToolbarItem>
        <SearchInput
          data-testid="table-search-input"
          placeholder={t("searchForUser")}
          aria-label={t("search")}
          value={searchUser}
          onSearch={(_, _v, attribute) => {
            setSearchUser(attribute["haswords"]);
            refresh();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const target = e.target as HTMLInputElement;
              setSearchUser(target.value);
              refresh();
            }
          }}
          onClear={() => {
            setSearchUser("");
            refresh();
          }}
        />
      </ToolbarItem>
    );
  };

  const attributeSearchInput = () => {
    return (
      <>
        <DropdownPanel
          data-testid="select-attributes-dropdown"
          buttonText={t("selectAttributes")}
          setSearchDropdownOpen={setSearchDropdownOpen}
          searchDropdownOpen={searchDropdownOpen}
          width="15vw"
        >
          <UserDataTableAttributeSearchForm
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            profile={profile}
            createAttributeSearchChips={createAttributeSearchChips}
            clearAllFilters={clearAllFilters}
            searchUserWithAttributes={() => {
              searchUserWithAttributes();
              setSearchDropdownOpen(false);
            }}
          />
        </DropdownPanel>
        <Button
          icon={<ArrowRightIcon />}
          variant="control"
          onClick={() => {
            searchUserWithAttributes();
            setSearchDropdownOpen(false);
          }}
          aria-label={t("searchAttributes")}
        />
      </>
    );
  };

  const bruteForceProtectionToolbarItem = !realm.bruteForceProtected ? (
    <ToolbarItem>
      <Button
        variant={ButtonVariant.link}
        onClick={toggleDeleteDialog}
        data-testid="delete-user-btn"
        isDisabled={hasSelectedRows}
      >
        {t("deleteUser")}
      </Button>
    </ToolbarItem>
  ) : (
    <ToolbarItem>
      <Dropdown
        onOpenChange={(isOpen) => setKebabOpen(isOpen)}
        toggle={(ref) => (
          <MenuToggle
            ref={ref}
            isExpanded={kebabOpen}
            variant="plain"
            onClick={() => setKebabOpen(!kebabOpen)}
          >
            <EllipsisVIcon />
          </MenuToggle>
        )}
        isOpen={kebabOpen}
        shouldFocusToggleOnSelect
      >
        <DropdownList>
          <DropdownItem
            key="deleteUser"
            component="button"
            isDisabled={hasSelectedRows}
            onClick={() => {
              toggleDeleteDialog();
              setKebabOpen(false);
            }}
          >
            {t("deleteUser")}
          </DropdownItem>

          <DropdownItem
            key="unlock"
            component="button"
            onClick={() => {
              toggleUnlockUsersDialog();
              setKebabOpen(false);
            }}
          >
            {t("unlockAllUsers")}
          </DropdownItem>
        </DropdownList>
      </Dropdown>
    </ToolbarItem>
  );

  const actionItems = (
    <>
      <ToolbarItem>
        <Button data-testid="add-user" onClick={goToCreate}>
          {t("addUser")}
        </Button>
      </ToolbarItem>
      {bruteForceProtectionToolbarItem}
    </>
  );

  return (
    <>
      {searchItem()}
      {isManager ? actionItems : null}
    </>
  );
}
