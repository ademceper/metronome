/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/client-scopes/details/SearchFilter.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { Select as UISelect, SelectContent as UISelectContent, SelectItem as UISelectItem, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { Funnel as FilterIcon } from "@phosphor-icons/react"

import {
  AllClientScopes,
  AllClientScopeType,
  clientScopeTypesSelectOptions,
} from "../../client-scope/ClientScopeTypes";
import type { Row } from "../../clients/scopes/ClientScopes";
import useIsFeatureEnabled, { Feature } from "../../../utils/use-is-feature-enabled";
import { useMemo } from "react";
import { Select, SelectOption } from "../../../../shared/pf-compat"


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
const SelectList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

export type SearchType = "name" | "type" | "protocol";
export const PROTOCOLS = ["all", "saml", "openid-connect"] as const;
export type ProtocolType = (typeof PROTOCOLS)[number] | "oid4vc";

export const nameFilter =
  (search = "") =>
  (scope: Row) =>
    scope.name?.includes(search);
export const typeFilter = (type: AllClientScopeType) => (scope: Row) =>
  type === AllClientScopes.none || scope.type === type;

export const protocolFilter = (protocol: ProtocolType) => (scope: Row) =>
  protocol === "all" || scope.protocol === protocol;

type SearchToolbarProps = Omit<SearchDropdownProps, "withProtocol"> & {
  type: AllClientScopeType;
  onType: (value: AllClientScopes) => void;
  protocol?: ProtocolType;
  onProtocol?: (value: ProtocolType) => void;
};

type SearchDropdownProps = {
  searchType: SearchType;
  onSelect: (value: SearchType) => void;
  withProtocol?: boolean;
};

export const SearchDropdown = ({
  searchType,
  withProtocol = false,
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
      {t(`clientScopeSearch.${searchType}`)}
    </DropdownItem>
  );
  const options = [createDropdown("name"), createDropdown("type")];
  if (withProtocol) {
    options.push(createDropdown("protocol"));
  }

  return (
    <Dropdown
      onOpenChange={(isOpen) => setSearchToggle(isOpen)}
      toggle={(ref) => (
        <MenuToggle
          data-testid="clientScopeSearch"
          ref={ref}
          id="toggle-id"
          onClick={() => setSearchToggle(!searchToggle)}
        >
          <FilterIcon /> {t(`clientScopeSearch.${searchType}`)}
        </MenuToggle>
      )}
      isOpen={searchToggle}
    >
      <DropdownList>{options}</DropdownList>
    </Dropdown>
  );
};

export const SearchToolbar = ({
  searchType,
  onSelect,
  type,
  onType,
  protocol,
  onProtocol,
}: SearchToolbarProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const isFeatureEnabled = useIsFeatureEnabled();
  const protocols = useMemo<readonly ProtocolType[]>(
    () =>
      isFeatureEnabled(Feature.OpenId4VCI)
        ? ([...PROTOCOLS, "oid4vc"] as const)
        : PROTOCOLS,
    [isFeatureEnabled],
  );

  return (
    <>
      {searchType === "type" && (
        <>
          <ToolbarItem>
            <SearchDropdown
              searchType={searchType}
              onSelect={onSelect}
              withProtocol={!!protocol}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Select
              toggle={(ref) => (
                <MenuToggle
                  data-testid="clientScopeSearchType"
                  ref={ref}
                  isExpanded={open}
                  onClick={() => setOpen(!open)}
                >
                  {type === AllClientScopes.none
                    ? t("allTypes")
                    : t(`clientScopeTypes.${type}`)}
                </MenuToggle>
              )}
              onOpenChange={(val) => setOpen(val)}
              isOpen={open}
              selected={
                type === AllClientScopes.none
                  ? t("allTypes")
                  : t(`clientScopeTypes.${type}`)
              }
              onSelect={(_, value) => {
                onType(value as AllClientScopes);
                setOpen(false);
              }}
            >
              <SelectList>
                <SelectOption value={AllClientScopes.none}>
                  {t("allTypes")}
                </SelectOption>
                {clientScopeTypesSelectOptions(t)}
              </SelectList>
            </Select>
          </ToolbarItem>
        </>
      )}
      {searchType === "protocol" && !!protocol && (
        <>
          <ToolbarItem>
            <SearchDropdown
              searchType={searchType}
              onSelect={onSelect}
              withProtocol
            />
          </ToolbarItem>
          <ToolbarItem>
            <Select
              toggle={(ref) => (
                <MenuToggle
                  data-testid="clientScopeSearchProtocol"
                  ref={ref}
                  isExpanded={open}
                  onClick={() => setOpen(!open)}
                >
                  {t(`protocolTypes.${protocol}`)}
                </MenuToggle>
              )}
              onOpenChange={(val) => setOpen(val)}
              isOpen={open}
              selected={t(`protocolTypes.${protocol}`)}
              onSelect={(_, value) => {
                onProtocol?.(value as ProtocolType);
                setOpen(false);
              }}
            >
              <SelectList>
                {protocols.map((type) => (
                  <SelectOption key={type} value={type}>
                    {t(`protocolTypes.${type}`)}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </ToolbarItem>
        </>
      )}
    </>
  );
};
