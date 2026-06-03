/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/scopes/AddScopeDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type ClientScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientScopeRepresentation";
import { KeycloakSelect } from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { CaretDown as CaretDownIcon, CaretUp as CaretUpIcon, Funnel as FilterIcon } from "@phosphor-icons/react"
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ClientScopeType,
  clientScopeTypesDropdown,
} from "../../client-scope/ClientScopeTypes";
import { ListEmptyState } from "@metronome/ui/components/list-empty-state";
import { DataTable } from "@metronome/ui/components/data-table";
import useToggle from "../../../utils/use-toggle";
import { getProtocolName } from "../utils";
import useIsFeatureEnabled, { Feature } from "../../../utils/use-is-feature-enabled";
import { SelectOption } from "../../../../shared/pf-compat"

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
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const Modal = ({ isOpen, onClose, title, description, variant, actions, header, footer, children, ...props }: any) => (
  <UIDialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()}>
    <UIDialogContent {...props}>
      {(title || header) ? (
        <UIDialogHeader>
          {title ? <UIDialogTitle>{title}</UIDialogTitle> : null}
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
          {header}
        </UIDialogHeader>
      ) : null}
      {children}
      {(actions || footer) ? (
        <UIDialogFooter>
          {actions}
          {footer}
        </UIDialogFooter>
      ) : null}
    </UIDialogContent>
  </UIDialog>
);
const ModalVariant = {
  small: "small",
  medium: "medium",
  large: "large",
  default: "default",
} as const;

export type AddScopeDialogProps = {
  clientScopes: ClientScopeRepresentation[];
  clientName?: string;
  open: boolean;
  toggleDialog: () => void;
  onAdd: (
    scopes: { scope: ClientScopeRepresentation; type?: ClientScopeType }[],
  ) => void;
  isClientScopesConditionType?: boolean;
};

enum FilterType {
  Name = "Name",
  Protocol = "Protocol",
}

enum ProtocolType {
  All = "All",
  SAML = "SAML",
  OpenIDConnect = "OpenID Connect",
  OID4VC = "OpenID4VC",
}

export const AddScopeDialog = ({
  clientScopes: scopes,
  clientName,
  open,
  toggleDialog,
  onAdd,
  isClientScopesConditionType,
}: AddScopeDialogProps) => {
  const { t } = useTranslation();
  const isFeatureEnabled = useIsFeatureEnabled();
  const [addToggle, setAddToggle] = useState(false);
  const [rows, setRows] = useState<ClientScopeRepresentation[]>([]);
  const [filterType, setFilterType] = useState(FilterType.Name);
  const [protocolType, setProtocolType] = useState(ProtocolType.All);

  const isOid4vcEnabled = isFeatureEnabled(Feature.OpenId4VCI);

  const [isFilterTypeDropdownOpen, toggleIsFilterTypeDropdownOpen] =
    useToggle();

  const [isProtocolTypeDropdownOpen, toggleIsProtocolTypeDropdownOpen] =
    useToggle(false);

  const clientScopes = useMemo(() => {
    if (protocolType === ProtocolType.OpenIDConnect) {
      return scopes.filter((item) => item.protocol === "openid-connect");
    } else if (protocolType === ProtocolType.SAML) {
      return scopes.filter((item) => item.protocol === "saml");
    } else if (protocolType === ProtocolType.OID4VC) {
      return scopes.filter((item) => item.protocol === "oid4vc");
    }
    return scopes;
  }, [scopes, filterType, protocolType]);

  const action = (scope: ClientScopeType) => {
    const scopes = rows.map((row) => {
      return { scope: row, type: scope };
    });
    onAdd(scopes);
    setAddToggle(false);
    toggleDialog();
  };

  const onFilterTypeDropdownSelect = (filterType: string) => {
    if (filterType === FilterType.Name) {
      setFilterType(FilterType.Protocol);
    } else if (filterType === FilterType.Protocol) {
      setFilterType(FilterType.Name);
      setProtocolType(ProtocolType.All);
    }

    toggleIsFilterTypeDropdownOpen();
  };

  const onProtocolTypeDropdownSelect = (protocolType: string) => {
    if (protocolType === ProtocolType.SAML) {
      setProtocolType(ProtocolType.SAML);
    } else if (protocolType === ProtocolType.OpenIDConnect) {
      setProtocolType(ProtocolType.OpenIDConnect);
    } else if (protocolType === ProtocolType.OID4VC) {
      setProtocolType(ProtocolType.OID4VC);
    } else if (protocolType === ProtocolType.All) {
      setProtocolType(ProtocolType.All);
    }

    toggleIsProtocolTypeDropdownOpen();
  };

  const protocolTypeOptions = useMemo(() => {
    const options = [
      <SelectOption key={1} value={ProtocolType.SAML}>
        {t("protocolTypes.saml")}
      </SelectOption>,
      <SelectOption key={2} value={ProtocolType.OpenIDConnect}>
        {t("protocolTypes.openid-connect")}
      </SelectOption>,
    ];

    if (isOid4vcEnabled) {
      options.push(
        <SelectOption key={3} value={ProtocolType.OID4VC}>
          {t("protocolTypes.oid4vc")}
        </SelectOption>,
      );
    }

    options.push(
      <SelectOption key={4} value={ProtocolType.All}>
        {t("protocolTypes.all")}
      </SelectOption>,
    );

    return options;
  }, [t, isOid4vcEnabled]);

  return (
    <Modal
      variant={ModalVariant.medium}
      title={
        isClientScopesConditionType
          ? t("addClientScope")
          : t("addClientScopesTo", { clientName })
      }
      isOpen={open}
      onClose={toggleDialog}
      actions={
        isClientScopesConditionType
          ? [
              <Button
                id="modal-add"
                data-testid="confirm"
                key="add"
                variant={ButtonVariant.primary}
                onClick={() => {
                  const scopes = rows.map((scope) => ({ scope }));
                  onAdd(scopes);
                  toggleDialog();
                }}
                isDisabled={rows.length === 0}
              >
                {t("add")}
              </Button>,
              <Button
                id="modal-cancel"
                data-testid="cancel"
                key="cancel"
                variant={ButtonVariant.link}
                onClick={() => {
                  setRows([]);
                  toggleDialog();
                }}
              >
                {t("cancel")}
              </Button>,
            ]
          : [
              <Dropdown
                popperProps={{
                  direction: "up",
                }}
                onOpenChange={(isOpen) => setAddToggle(isOpen)}
                className="keycloak__client-scopes-add__add-dropdown"
                key="add-dropdown"
                isOpen={addToggle}
                toggle={(ref) => (
                  <MenuToggle
                    ref={ref}
                    isDisabled={rows.length === 0}
                    onClick={() => setAddToggle(!addToggle)}
                    variant="primary"
                    id="add-dropdown"
                    data-testid="add-dropdown"
                    statusIcon={<CaretUpIcon />}
                  >
                    {t("add")}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  {clientScopeTypesDropdown(t, action)}
                </DropdownList>
              </Dropdown>,
              <Button
                id="modal-cancel"
                key="cancel"
                variant={ButtonVariant.link}
                onClick={() => {
                  setRows([]);
                  toggleDialog();
                }}
              >
                {t("cancel")}
              </Button>,
            ]
      }
    >
      <DataTable
        t={t}
        loader={clientScopes}
        ariaLabelKey="chooseAMapperType"
        searchPlaceholderKey={
          filterType === FilterType.Name ? "searchForClientScope" : undefined
        }
        isSearching={filterType !== FilterType.Name}
        searchTypeComponent={
          <Dropdown
            onSelect={() => {
              onFilterTypeDropdownSelect(filterType);
            }}
            onOpenChange={toggleIsFilterTypeDropdownOpen}
            toggle={(ref) => (
              <MenuToggle
                ref={ref}
                data-testid="filter-type-dropdown"
                id="toggle-id-9"
                onClick={toggleIsFilterTypeDropdownOpen}
                icon={<FilterIcon />}
                statusIcon={<CaretDownIcon />}
              >
                {filterType}
              </MenuToggle>
            )}
            isOpen={isFilterTypeDropdownOpen}
          >
            <DropdownList>
              <DropdownItem
                data-testid="filter-type-dropdown-item"
                key="filter-type"
              >
                {filterType === FilterType.Name ? t("protocol") : t("name")}
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        }
        toolbarItem={
          filterType === FilterType.Protocol && (
            <>
              <Dropdown
                onSelect={() => {
                  onFilterTypeDropdownSelect(filterType);
                }}
                onOpenChange={toggleIsFilterTypeDropdownOpen}
                data-testid="filter-type-dropdown"
                toggle={(ref) => (
                  <MenuToggle
                    ref={ref}
                    id="toggle-id-9"
                    onClick={toggleIsFilterTypeDropdownOpen}
                    statusIcon={<CaretDownIcon />}
                    icon={<FilterIcon />}
                  >
                    {filterType}
                  </MenuToggle>
                )}
                isOpen={isFilterTypeDropdownOpen}
              >
                <DropdownList>
                  <DropdownItem
                    data-testid="filter-type-dropdown-item"
                    key="filter-type"
                  >
                    {t("name")}
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
              <KeycloakSelect
                className="kc-protocolType-select"
                aria-label={t("selectOne")}
                onToggle={toggleIsProtocolTypeDropdownOpen}
                onSelect={(value) =>
                  onProtocolTypeDropdownSelect(value.toString())
                }
                selections={protocolType}
                isOpen={isProtocolTypeDropdownOpen}
              >
                {protocolTypeOptions}
              </KeycloakSelect>
            </>
          )
        }
        canSelectAll
        onSelect={(rows) => setRows(rows)}
        columns={[
          {
            name: "name",
          },
          {
            name: "protocol",
            displayKey: "protocol",
            cellRenderer: (client) =>
              getProtocolName(t, client.protocol ?? "openid-connect"),
          },
          {
            name: "description",
          },
        ]}
        emptyState={
          <ListEmptyState
            message={t("emptyAddClientScopes")}
            instructions={t("emptyAddClientScopesInstructions")}
          />
        }
      />
    </Modal>
  );
};
