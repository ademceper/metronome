/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/permission-configuration/ExistingPoliciesDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import { PolicyQuery } from "@keycloak/keycloak-admin-client/lib/resources/clients";
import {
  KeycloakDataTable,
  ListEmptyState,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { CaretDown as CaretDownIcon, Funnel as FilterIcon } from "@phosphor-icons/react"
import { sortBy } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { capitalizeFirstLetterFormatter } from "../../../util";
import useToggle from "../../../utils/use-toggle";


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

export type ExistingPoliciesDialogProps = {
  toggleDialog: () => void;
  onAssign: (policies: { policy: PolicyRepresentation }[]) => void;
  open: boolean;
  permissionClientId: string;
};

export const ExistingPoliciesDialog = ({
  toggleDialog,
  onAssign,
  open,
  permissionClientId,
}: ExistingPoliciesDialogProps) => {
  const { t } = useTranslation();
  const { adminClient } = useAdminClient();
  const [rows, setRows] = useState<PolicyRepresentation[]>([]);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [isFilterTypeDropdownOpen, toggleIsFilterTypeDropdownOpen] =
    useToggle();
  const [providers, setProviders] = useState<string[]>([]);

  useFetch(
    () =>
      adminClient.clients.listPolicyProviders({
        id: permissionClientId!,
      }),
    (providers) => {
      const formattedProviders = providers
        .filter((p) => p.type !== "resource" && p.type !== "scope")
        .map((provider) => provider.name)
        .filter((name) => name !== undefined);
      setProviders(sortBy(formattedProviders));
    },
    [permissionClientId],
  );

  const loader = async (first?: number, max?: number, search?: string) => {
    const params: PolicyQuery = {
      id: permissionClientId!,
      permission: "false",
      first,
      max,
    };

    if (search) {
      params.name = search;
    }

    if (filterType) {
      params.type = filterType;
    }

    return (await adminClient.clients.listPolicies(params)) || [];
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t("assignExistingPolicies")}
      isOpen={open}
      onClose={toggleDialog}
      actions={[
        <>
          <Button
            id="modal-assignExistingPolicies"
            data-testid="confirm"
            key="assign"
            variant={ButtonVariant.primary}
            onClick={() => {
              const selectedPolicies = rows.map((policy) => ({ policy }));
              onAssign(selectedPolicies);
              toggleDialog();
            }}
            isDisabled={rows.length === 0}
          >
            {t("assign")}
          </Button>
          <Button
            id="modal-cancelExistingPolicies"
            data-testid="cancel"
            key="cancel"
            variant={ButtonVariant.link}
            onClick={() => {
              setRows([]);
              toggleDialog();
            }}
          >
            {t("cancel")}
          </Button>
        </>,
      ]}
    >
      <KeycloakDataTable
        key={filterType}
        loader={loader}
        ariaLabelKey={t("chooseAPolicyType")}
        searchPlaceholderKey={t("searchClientAuthorizationPolicy")}
        isSearching={true}
        searchTypeComponent={
          <Dropdown
            onSelect={(_, value) => {
              setFilterType(value as string | undefined);
              toggleIsFilterTypeDropdownOpen();
            }}
            onOpenChange={toggleIsFilterTypeDropdownOpen}
            toggle={(ref) => (
              <MenuToggle
                ref={ref}
                data-testid="filter-type-dropdown-existingPolicies"
                id="toggle-id-10"
                onClick={toggleIsFilterTypeDropdownOpen}
                icon={<FilterIcon />}
                statusIcon={<CaretDownIcon />}
              >
                {filterType ? filterType : t("allTypes")}
              </MenuToggle>
            )}
            isOpen={isFilterTypeDropdownOpen}
          >
            <DropdownList>
              <DropdownItem
                data-testid="filter-type-dropdown-existingPolicies-all"
                key="all"
                onClick={() => setFilterType(undefined)}
              >
                {t("allTypes")}
              </DropdownItem>
              {providers.map((name) => (
                <DropdownItem
                  data-testid={`filter-type-dropdown-existingPolicies-${name}`}
                  key={name}
                  onClick={() => setFilterType(name)}
                >
                  {name}
                </DropdownItem>
              ))}
            </DropdownList>
          </Dropdown>
        }
        canSelectAll
        onSelect={(selectedRows) => setRows(selectedRows)}
        columns={[
          { name: "name" },
          {
            name: "type",
            cellFormatters: [capitalizeFirstLetterFormatter()],
          },
          { name: "description" },
        ]}
        emptyState={
          <ListEmptyState
            message={t("emptyAssignExistingPolicies")}
            instructions={t("emptyAssignExistingPoliciesInstructions")}
          />
        }
      />
    </Modal>
  );
};
