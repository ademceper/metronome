/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/scopes/ClientScopes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type ClientScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientScopeRepresentation";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { DotsThreeVertical as EllipsisVIcon } from "@phosphor-icons/react"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { ChangeTypeDropdown } from "../../client-scopes/ChangeTypeDropdown";
import {
  SearchDropdown,
  SearchToolbar,
  SearchType,
  nameFilter,
  typeFilter,
} from "../../client-scopes/details/SearchFilter";
import {
  AllClientScopeType,
  AllClientScopes,
  CellDropdown,
  ClientScope,
  addClientScope,
  changeClientScope,
  removeClientScope,
} from "../../client-scope/ClientScopeTypes";
import { useConfirmDialog } from "../../confirm-dialog/ConfirmDialog";
import { ListEmptyState } from "../../../../shared/keycloak-ui-shared";
import { Action, KeycloakDataTable } from "../../../../shared/keycloak-ui-shared";
import { useAccess } from "../../../context/access/access";
import { useRealm } from "../../../context/realm-context/realm-context";
import { translationFormatter } from "../../../utils/translation-formatter";
import useLocaleSort, { mapByKey } from "../../../utils/use-locale-sort";
import { toDedicatedScope } from "../../../lib/clients";
import { AddScopeDialog } from "./AddScopeDialog";
import useIsFeatureEnabled, { Feature } from "../../../utils/use-is-feature-enabled";
import { PROTOCOL_OIDC, PROTOCOL_OID4VC } from "../constants";

const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
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
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

export type ClientScopesProps = {
  clientId: string;
  protocol: string;
  clientName: string;
  fineGrainedAccess?: boolean;
};

export type Row = ClientScopeRepresentation & {
  type: AllClientScopeType;
  description?: string;
};

const DEDICATED_ROW = "dedicated";

type TypeSelectorProps = Row & {
  clientId: string;
  fineGrainedAccess?: boolean;
  refresh: () => void;
};

const TypeSelector = ({
  clientId,
  refresh,
  fineGrainedAccess,
  ...scope
}: TypeSelectorProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const { hasAccess } = useAccess();

  const isDedicatedRow = (value: Row) => value.id === DEDICATED_ROW;
  const isManager = hasAccess("manage-clients") || fineGrainedAccess;

  return (
    <CellDropdown
      isDisabled={isDedicatedRow(scope) || !isManager}
      clientScope={scope}
      type={scope.type}
      onSelect={async (value) => {
        try {
          await changeClientScope(
            adminClient,
            clientId,
            scope,
            scope.type,
            value as ClientScope,
          );
          addAlert(t("clientScopeSuccess"), AlertVariant.success);
          refresh();
        } catch (error) {
          addError("clientScopeError", error);
        }
      }}
    />
  );
};

export const ClientScopes = ({
  clientId,
  protocol,
  clientName,
  fineGrainedAccess,
}: ClientScopesProps) => {
  const { adminClient } = useAdminClient();
  const isFeatureEnabled = useIsFeatureEnabled();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const { realm } = useRealm();
  const localeSort = useLocaleSort();

  const [searchType, setSearchType] = useState<SearchType>("name");

  const [searchTypeType, setSearchTypeType] = useState<AllClientScopes>(
    AllClientScopes.none,
  );

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [rest, setRest] = useState<ClientScopeRepresentation[]>();
  const [selectedRows, setSelectedRowState] = useState<Row[]>([]);
  const setSelectedRows = (rows: Row[]) =>
    setSelectedRowState(rows.filter(({ id }) => id !== DEDICATED_ROW));
  const [kebabOpen, setKebabOpen] = useState(false);

  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);
  const isDedicatedRow = (value: Row) => value.id === DEDICATED_ROW;

  const { hasAccess } = useAccess();
  const isManager = hasAccess("manage-clients") || fineGrainedAccess;
  const isViewer = hasAccess("view-clients") || fineGrainedAccess;

  const loader = async (first?: number, max?: number, search?: string) => {
    const defaultClientScopes =
      await adminClient.clients.listDefaultClientScopes({ id: clientId });
    const optionalClientScopes =
      await adminClient.clients.listOptionalClientScopes({ id: clientId });
    const clientScopes = await adminClient.clientScopes.find();

    const find = (id: string) =>
      clientScopes.find((clientScope) => id === clientScope.id);

    const optional = optionalClientScopes.map((c) => {
      const scope = find(c.id!);
      const row: Row = {
        ...c,
        type: ClientScope.optional,
        description: scope?.description,
      };
      return row;
    });

    const defaultScopes = defaultClientScopes.map((c) => {
      const scope = find(c.id!);
      const row: Row = {
        ...c,
        type: ClientScope.default,
        description: scope?.description,
      };
      return row;
    });

    let rows = [...optional, ...defaultScopes];
    const names = rows.map((row) => row.name);

    const allowedProtocols = (() => {
      if (protocol === PROTOCOL_OIDC) {
        return isFeatureEnabled(Feature.OpenId4VCI)
          ? [PROTOCOL_OIDC, PROTOCOL_OID4VC]
          : [PROTOCOL_OIDC];
      }
      return [protocol];
    })();

    setRest(
      clientScopes
        .filter((scope) => !names.includes(scope.name))
        .filter(
          (scope) =>
            scope.protocol && allowedProtocols.includes(scope.protocol),
        ),
    );

    rows = localeSort(rows, mapByKey("name"));

    if (isViewer) {
      rows.unshift({
        id: DEDICATED_ROW,
        name: t("dedicatedScopeName", { clientName }),
        type: AllClientScopes.none,
        description: t("dedicatedScopeDescription"),
      });
    }

    const filter =
      searchType === "name" ? nameFilter(search) : typeFilter(searchTypeType);
    const firstNum = Number(first);

    return rows.filter(filter).slice(firstNum, firstNum + Number(max));
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteClientScope", {
      count: selectedRows.length,
      name: selectedRows[0]?.name,
    }),
    messageKey: "deleteConfirmClientScopes",
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await removeClientScope(
          adminClient,
          clientId,
          selectedRows[0],
          selectedRows[0].type as ClientScope,
        );
        addAlert(t("clientScopeRemoveSuccess"), AlertVariant.success);
        refresh();
      } catch (error) {
        addError("clientScopeRemoveError", error);
      }
    },
  });

  return (
    <>
      {rest && (
        <AddScopeDialog
          clientScopes={rest}
          clientName={clientName!}
          open={addDialogOpen}
          toggleDialog={() => setAddDialogOpen(!addDialogOpen)}
          onAdd={async (scopes) => {
            try {
              await Promise.all(
                scopes.map(
                  async (scope) =>
                    await addClientScope(
                      adminClient,
                      clientId,
                      scope.scope,
                      scope.type!,
                    ),
                ),
              );
              addAlert(t("clientScopeSuccess"), AlertVariant.success);
              refresh();
            } catch (error) {
              addError("clientScopeError", error);
            }
          }}
        />
      )}

      <KeycloakDataTable
        key={key}
        loader={loader}
        ariaLabelKey="clientScopeList"
        searchPlaceholderKey={
          searchType === "name" ? "searchByName" : undefined
        }
        canSelectAll
        isPaginated
        isSearching={searchType === "type"}
        onSelect={(rows) => setSelectedRows([...rows])}
        searchTypeComponent={
          <SearchDropdown
            searchType={searchType}
            onSelect={(searchType) => setSearchType(searchType)}
          />
        }
        toolbarItem={
          <>
            <SearchToolbar
              searchType={searchType}
              type={searchTypeType}
              onSelect={(searchType) => setSearchType(searchType)}
              onType={(value) => {
                setSearchTypeType(value);
                refresh();
              }}
            />
            {isManager && (
              <>
                <DeleteConfirm />
                <ToolbarItem>
                  <Button onClick={() => setAddDialogOpen(true)}>
                    {t("addClientScope")}
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <ChangeTypeDropdown
                    clientId={clientId}
                    selectedRows={selectedRows}
                    refresh={refresh}
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Dropdown
                    onOpenChange={(isOpen) => setKebabOpen(isOpen)}
                    toggle={(ref) => (
                      <MenuToggle
                        data-testid="kebab"
                        aria-label="Kebab toggle"
                        ref={ref}
                        variant="plain"
                        onClick={() => setKebabOpen(!kebabOpen)}
                        isExpanded={kebabOpen}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                    isOpen={kebabOpen}
                  >
                    <DropdownList>
                      <DropdownItem
                        key="deleteAll"
                        isDisabled={selectedRows.length === 0}
                        onClick={async () => {
                          try {
                            await Promise.all(
                              selectedRows.map((row) =>
                                removeClientScope(
                                  adminClient,
                                  clientId,
                                  { ...row },
                                  row.type as ClientScope,
                                ),
                              ),
                            );

                            setKebabOpen(false);
                            setSelectedRows([]);
                            addAlert(t("clientScopeRemoveSuccess"));
                            refresh();
                          } catch (error) {
                            addError("clientScopeRemoveError", error);
                          }
                        }}
                      >
                        {t("remove")}
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </ToolbarItem>
              </>
            )}
          </>
        }
        columns={[
          {
            name: "name",
            displayKey: "assignedClientScope",
            cellRenderer: (row) => {
              if (isDedicatedRow(row)) {
                return (
                  <Link to={toDedicatedScope({ realm, clientId })}>
                    {row.name}
                  </Link>
                );
              }
              return row.name!;
            },
          },
          {
            name: "type",
            displayKey: "assignedType",
            cellRenderer: (row) => (
              <TypeSelector clientId={clientId} refresh={refresh} {...row} />
            ),
          },
          { name: "description", cellFormatters: [translationFormatter(t)] },
        ]}
        actions={
          isManager
            ? [
                {
                  title: t("remove"),
                  onRowClick: async (row) => {
                    setSelectedRows([row]);
                    toggleDeleteDialog();
                    return true;
                  },
                } as Action<Row>,
              ]
            : []
        }
        emptyState={
          <ListEmptyState
            message={t("emptyClientScopes")}
            instructions={t("emptyClientScopesInstructions")}
            primaryActionText={t("emptyClientScopesPrimaryAction")}
            onPrimaryAction={() => setAddDialogOpen(true)}
          />
        }
      />
    </>
  );
};
