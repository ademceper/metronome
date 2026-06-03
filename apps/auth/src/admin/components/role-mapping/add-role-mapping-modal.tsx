/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/role-mapping/AddRoleMappingModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { DataTable } from "@metronome/ui/components/table/data-table";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
const cellWidth = (_n: number) => () => ({ className: '' });
const TableText = ({ children }: any) => (
  <span className="block truncate">{children}</span>
);
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { useAccess } from "../../context/access/access";
import { translationFormatter } from "../../utils/translation-formatter";
import useLocaleSort from "../../utils/use-locale-sort";
import useToggle from "../../utils/use-toggle";
import { ResourcesKey, Row } from "./role-mapping";
import { getAvailableRoles } from "./queries";
import { getAvailableClientRoles } from "./resource";


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
type DropdownProps = React.ComponentProps<typeof Dropdown>;

type AddRoleMappingModalProps = {
  id: string;
  type: ResourcesKey;
  filterType: FilterType;
  name?: string;
  isRadio?: boolean;
  onAssign: (rows: Row[]) => void;
  onClose: () => void;
  title?: string;
  actionLabel?: string;
};

export type FilterType = "roles" | "clients";

const RoleDescription = ({ role }: { role: RoleRepresentation }) => {
  const { t } = useTranslation();
  return (
    <TableText wrapModifier="truncate">
      {translationFormatter(t)(role.description) as string}
    </TableText>
  );
};

type AddRoleButtonProps = Omit<
  DropdownProps,
  "children" | "toggle" | "isOpen" | "onOpenChange"
> & {
  label?: string;
  variant?: "default" | "plain" | "primary" | "plainText" | "secondary";
  isDisabled?: boolean;
  onFilerTypeChange: (type: FilterType) => void;
};

export const AddRoleButton = ({
  label,
  variant,
  isDisabled,
  onFilerTypeChange,
  ...rest
}: AddRoleButtonProps) => {
  const { t } = useTranslation();
  const [open, toggle] = useToggle();

  const { hasAccess } = useAccess();
  const canViewRealmRoles = hasAccess("view-realm") || hasAccess("query-users");

  return (
    <Dropdown
      onOpenChange={toggle}
      toggle={(ref) => (
        <MenuToggle
          ref={ref}
          onClick={toggle}
          variant={variant || "primary"}
          isDisabled={isDisabled}
          data-testid="add-role-mapping-button"
        >
          {t(label || "assignRole")}
        </MenuToggle>
      )}
      isOpen={open}
      {...rest}
    >
      <DropdownList>
        <DropdownItem
          data-testid="client-role"
          component="button"
          onClick={() => {
            onFilerTypeChange("clients");
          }}
        >
          {t("clientRoles")}
        </DropdownItem>
        {canViewRealmRoles && (
          <DropdownItem
            data-testid="roles-role"
            component="button"
            onClick={() => {
              onFilerTypeChange("roles");
            }}
          >
            {t("realmRoles")}
          </DropdownItem>
        )}
      </DropdownList>
    </Dropdown>
  );
};

export const AddRoleMappingModal = ({
  id,
  name,
  type,
  isRadio,
  filterType,
  onAssign,
  onClose,
  title,
  actionLabel,
}: AddRoleMappingModalProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState<Row[]>([]);

  const localeSort = useLocaleSort();
  const compareRow = ({ role: { name } }: Row) => name?.toUpperCase();

  const loader = async (
    first?: number,
    max?: number,
    search?: string,
  ): Promise<Row[]> => {
    const params: Record<string, string | number> = {
      first: first!,
      max: max!,
    };

    if (search) {
      params.search = search;
    }

    const roles = await getAvailableRoles(adminClient, type, { ...params, id });
    const sorted = localeSort(roles, compareRow);
    return sorted.map((row) => {
      return {
        role: row.role,
        id: row.role.id,
      };
    });
  };

  const clientRolesLoader = async (
    first?: number,
    max?: number,
    search?: string,
  ): Promise<Row[]> => {
    const roles = await getAvailableClientRoles(adminClient, {
      id,
      type,
      first: first || 0,
      max: max || 10,
      search,
    });

    return localeSort(
      roles.map((e) => ({
        client: { clientId: e.client, id: e.clientId },
        role: { id: e.id, name: e.role, description: e.description },
        id: e.id,
      })),
      ({ client: { clientId }, role: { name } }) => `${clientId}${name}`,
    );
  };

  const columns = [
    {
      name: "role.name",
      displayKey: "name",
      transforms: [cellWidth(30)],
    },
    {
      name: "client.clientId",
      displayKey: "clientId",
    },
    {
      name: "role.description",
      displayKey: "description",
      cellRenderer: RoleDescription,
    },
  ];

  if (filterType === "roles") {
    columns.splice(1, 1);
  }

  return (
    <Modal
      variant={ModalVariant.large}
      title={
        title ||
        t("assignRolesTo", {
          type: filterType === "roles" ? t("realm") : t("client"),
          client: name,
        })
      }
      isOpen
      onClose={onClose}
      actions={[
        <Button
          data-testid="assign"
          key="confirm"
          isDisabled={selectedRows.length === 0}
          variant="primary"
          onClick={() => {
            onAssign(selectedRows);
            onClose();
          }}
        >
          {actionLabel || t("assign")}
        </Button>,
        <Button
          data-testid="cancel"
          key="cancel"
          variant="link"
          onClick={onClose}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <DataTable
        t={t}
        onSelect={(rows) => setSelectedRows([...rows])}
        searchPlaceholderKey={
          filterType === "roles" ? "searchByRoleName" : "search"
        }
        isPaginated={!(filterType === "roles" && type !== "roles")}
        canSelectAll
        isRadio={isRadio}
        loader={filterType === "roles" ? loader : clientRolesLoader}
        ariaLabelKey="associatedRolesText"
        columns={columns}
        emptyState={
          <ListEmptyState
            message={t("noRoles")}
            instructions={t("noRealmRolesToAssign")}
          />
        }
      />
    </Modal>
  );
};
