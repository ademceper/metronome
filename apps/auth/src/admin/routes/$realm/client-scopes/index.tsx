// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { usePageHeader } from "@metronome/ui/blocks/layout/page-header"
import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { DotsThreeVertical as EllipsisVIcon } from "@phosphor-icons/react"
const cellWidth = (_n: number) => () => ({ className: '' });
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import type { Row } from "../../../components/clients/scopes/ClientScopes";
import { getProtocolName } from "../../../components/clients/utils";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import {
  AllClientScopeType,
  AllClientScopes,
  CellDropdown,
  ClientScope,
  ClientScopeDefaultOptionalType,
  changeScope,
  removeScope,
} from "../../../components/client-scope/ClientScopeTypes";
import { useConfirmDialog } from "../../../components/confirm-dialog/ConfirmDialog";
import { Action, DataTable } from "@metronome/ui/components/data-table";
import { ViewHeader } from "../../../components/view-header/ViewHeader";
import { useRealm } from "../../../context/realm-context/realm-context";
import helpUrls from "../../../help-urls";
import { emptyFormatter } from "../../../util";
import useLocaleSort, { mapByKey } from "../../../utils/use-locale-sort";
import { ChangeTypeDropdown } from "../../../components/client-scopes/ChangeTypeDropdown";
import {
  ProtocolType,
  SearchDropdown,
  SearchToolbar,
  SearchType,
  nameFilter,
  protocolFilter,
  typeFilter,
} from "../../../components/client-scopes/details/SearchFilter";
import { toClientScope } from "../../../lib/client-scopes";
import { toNewClientScope } from "../../../lib/client-scopes";

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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

type TypeSelectorProps = ClientScopeDefaultOptionalType & {
  refresh: () => void;
};

const TypeSelector = (scope: TypeSelectorProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  return (
    <CellDropdown
      clientScope={scope}
      type={scope.type}
      all
      onSelect={async (value) => {
        try {
          await changeScope(adminClient, scope, value as AllClientScopeType);
          addAlert(t("clientScopeSuccess"), AlertVariant.success);
          scope.refresh();
        } catch (error) {
          addError("clientScopeError", error);
        }
      }}
    />
  );
};

const ClientScopeDetailLink = ({
  id,
  name,
}: ClientScopeDefaultOptionalType) => {
  const { realm } = useRealm();
  return (
    <Link key={id} to={toClientScope({ realm, id: id!, tab: "settings" })}>
      {name}
    </Link>
  );
};

function ClientScopesSection() {
  const { adminClient } = useAdminClient();

  const { realm } = useRealm();
  const { t } = useTranslation();
  usePageHeader({ title: t("clientScopes"), description: t("clientScopesExplain") });
  const { addAlert, addError } = useAlerts();

  const [kebabOpen, setKebabOpen] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState<
    ClientScopeDefaultOptionalType[]
  >([]);

  const [searchType, setSearchType] = useState<SearchType>("name");
  const [searchTypeType, setSearchTypeType] = useState<AllClientScopes>(
    AllClientScopes.none,
  );
  const [searchProtocol, setSearchProtocol] = useState<ProtocolType>("all");
  const localeSort = useLocaleSort();

  const [key, setKey] = useState(0);
  const refresh = () => {
    setSelectedScopes([]);
    setKey(key + 1);
  };

  const loader = async (first?: number, max?: number, search?: string) => {
    const defaultScopes =
      await adminClient.clientScopes.listDefaultClientScopes();
    const optionalScopes =
      await adminClient.clientScopes.listDefaultOptionalClientScopes();
    const clientScopes = await adminClient.clientScopes.find();

    const filter =
      searchType === "name"
        ? nameFilter(search)
        : searchType === "type"
          ? typeFilter(searchTypeType)
          : protocolFilter(searchProtocol);

    const transformed = clientScopes
      .map((scope) => {
        const row: Row = {
          ...scope,
          type: defaultScopes.find(
            (defaultScope) => defaultScope.name === scope.name,
          )
            ? ClientScope.default
            : optionalScopes.find(
                  (optionalScope) => optionalScope.name === scope.name,
                )
              ? ClientScope.optional
              : AllClientScopes.none,
        };
        return row;
      })
      .filter(filter);

    return localeSort(transformed, mapByKey("name")).slice(
      first,
      Number(first) + Number(max),
    );
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteClientScope", {
      count: selectedScopes.length,
      name: selectedScopes[0]?.name,
    }),
    messageKey: "deleteConfirmClientScopes",
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      const clientScopes = await adminClient.clientScopes.find();
      const clientScopeLength = Object.keys(clientScopes).length;
      if (clientScopeLength - selectedScopes.length > 0) {
        try {
          for (const scope of selectedScopes) {
            try {
              await removeScope(adminClient, scope);
            } catch (error: any) {
              console.warn(
                "could not remove scope",
                error.response?.data?.errorMessage || error,
              );
            }
            await adminClient.clientScopes.del({ id: scope.id! });
          }
          addAlert(t("deletedSuccessClientScope"), AlertVariant.success);
          refresh();
        } catch (error) {
          addError("deleteErrorClientScope", error);
        }
      } else {
        addAlert(t("notAllowedToDeleteAllClientScopes"), AlertVariant.danger);
      }
    },
  });

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        titleKey="clientScopes"
        subKey="clientScopeExplain"
        helpUrl={helpUrls.clientScopesUrl}
      />
      <PageSection variant="light" className="pf-v5-u-p-0">
        <DataTable
          t={t}
          key={key}
          loader={loader}
          ariaLabelKey="clientScopeList"
          searchPlaceholderKey={
            searchType === "name" ? "searchForClientScope" : undefined
          }
          isSearching={searchType !== "name"}
          searchTypeComponent={
            <SearchDropdown
              searchType={searchType}
              onSelect={(searchType) => setSearchType(searchType)}
              withProtocol
            />
          }
          isPaginated
          onSelect={(clientScopes) => setSelectedScopes([...clientScopes])}
          canSelectAll
          toolbarItem={
            <>
              <SearchToolbar
                searchType={searchType}
                type={searchTypeType}
                onSelect={(searchType) => {
                  setSearchType(searchType);
                  setSearchProtocol("all");
                  setSearchTypeType(AllClientScopes.none);
                  refresh();
                }}
                onType={(value) => {
                  setSearchTypeType(value);
                  setSearchProtocol("all");
                  refresh();
                }}
                protocol={searchProtocol}
                onProtocol={(protocol) => {
                  setSearchProtocol(protocol);
                  setSearchTypeType(AllClientScopes.none);
                  refresh();
                }}
              />

              <ToolbarItem>
                <Button
                  component={(props) => (
                    <Link {...props} to={toNewClientScope({ realm })} />
                  )}
                >
                  {t("createClientScope")}
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <ChangeTypeDropdown
                  selectedRows={selectedScopes}
                  refresh={refresh}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  shouldFocusToggleOnSelect
                  onOpenChange={(isOpen) => setKebabOpen(isOpen)}
                  toggle={(ref) => (
                    <MenuToggle
                      data-testid="kebab"
                      aria-label="Kebab toggle"
                      ref={ref}
                      onClick={() => setKebabOpen(!kebabOpen)}
                      variant="plain"
                    >
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  isOpen={kebabOpen}
                >
                  <DropdownList>
                    <DropdownItem
                      data-testid="delete"
                      isDisabled={selectedScopes.length === 0}
                      onClick={() => {
                        toggleDeleteDialog();
                        setKebabOpen(false);
                      }}
                    >
                      {t("delete")}
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </>
          }
          actions={[
            {
              title: t("delete"),
              onRowClick: (clientScope) => {
                setSelectedScopes([clientScope]);
                toggleDeleteDialog();
              },
            } as Action<Row>,
          ]}
          columns={[
            {
              name: "name",
              cellRenderer: ClientScopeDetailLink,
            },
            {
              name: "type",
              displayKey: "assignedType",
              cellRenderer: (row) => (
                <TypeSelector {...row} refresh={refresh} />
              ),
            },
            {
              name: "protocol",
              displayKey: "protocol",
              cellRenderer: (client) =>
                getProtocolName(t, client.protocol ?? "openid-connect"),
              transforms: [cellWidth(15)],
            },
            {
              name: "attributes['gui.order']",
              displayKey: "displayOrder",
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(15)],
            },
            { name: "description", cellFormatters: [emptyFormatter()] },
          ]}
        />
      </PageSection>
    </>
  );
}

export const Route = createFileRoute("/$realm/client-scopes/")({
  component: ClientScopesSection,
})
