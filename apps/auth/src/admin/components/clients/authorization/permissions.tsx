/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/Permissions.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type PolicyProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyProviderRepresentation";
import type PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import { useAlerts, useFetch } from "../../../../shared/keycloak-ui-shared";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { PaginatingTableToolbar } from "@metronome/ui/components/table/table-toolbar";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { cn } from "@metronome/ui/lib/utils";
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table/table";
const ExpandableRowContent = ({ children }: any) => <>{children}</>;
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { useConfirmDialog } from "../../confirm-dialog/confirm-dialog";
import { KeycloakSpinner } from "../../../../shared/keycloak-ui-shared";
import { useRealm } from "../../../context/realm-context/realm-context";
import useToggle from "../../../utils/use-toggle";
import { toNewPermission } from "../../../lib/clients";
import { toPermissionDetails } from "../../../lib/clients";
import { toPolicyDetails } from "../../../lib/clients";
import { DetailDescriptionLink } from "./detail-description";
import { EmptyPermissionsState } from "./empty-permissions-state";
import { MoreLabel } from "./more-label";
import { SearchDropdown, SearchForm } from "./search-dropdown";

const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};
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
const DescriptionList = ({ isHorizontal, columnModifier, children, ...props }: any) => (
  <dl className={cn("grid gap-y-2 text-sm",
    isHorizontal && "grid-cols-[max-content_1fr] gap-x-4",
    (props as any).className)} {...props}>
    {children}
  </dl>
);
const Divider = (props: any) => <UISeparator {...props} />;
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

type PermissionsProps = {
  clientId: string;
  isDisabled?: boolean;
};

type ExpandablePolicyRepresentation = PolicyRepresentation & {
  associatedPolicies?: PolicyRepresentation[];
  isExpanded: boolean;
};

const AssociatedPoliciesRenderer = ({
  row,
}: {
  row: ExpandablePolicyRepresentation;
}) => {
  return (
    <>
      {row.associatedPolicies?.[0]?.name || "—"}{" "}
      <MoreLabel array={row.associatedPolicies} />
    </>
  );
};

export const AuthorizationPermissions = ({
  clientId,
  isDisabled = false,
}: PermissionsProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addAlert, addError } = useAlerts();
  const { realm } = useRealm();

  const [permissions, setPermissions] =
    useState<ExpandablePolicyRepresentation[]>();
  const [selectedPermission, setSelectedPermission] =
    useState<PolicyRepresentation>();
  const [policyProviders, setPolicyProviders] =
    useState<PolicyProviderRepresentation[]>();
  const [disabledCreate, setDisabledCreate] = useState<{
    resources: boolean;
    scopes: boolean;
  }>();
  const [createOpen, toggleCreate] = useToggle();
  const [search, setSearch] = useState<SearchForm>({});

  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);

  useFetch(
    async () => {
      const permissions = await adminClient.clients.findPermissions({
        first,
        max: max + 1,
        id: clientId,
        ...search,
      });

      return await Promise.all(
        permissions.map(async (permission) => {
          const associatedPolicies =
            await adminClient.clients.getAssociatedPolicies({
              id: clientId,
              permissionId: permission.id!,
            });

          return {
            ...permission,
            associatedPolicies,
            isExpanded: false,
          };
        }),
      );
    },
    setPermissions,
    [key, search, first, max],
  );

  useFetch(
    async () => {
      const params = {
        first: 0,
        max: 1,
      };
      const [policies, resources, scopes] = await Promise.all([
        adminClient.clients.listPolicyProviders({
          id: clientId,
        }),
        adminClient.clients.listResources({ ...params, id: clientId }),
        adminClient.clients.listAllScopes({ ...params, id: clientId }),
      ]);
      return {
        policies: policies.filter(
          (p) => p.type === "resource" || p.type === "scope",
        ),
        resources: resources.length !== 1,
        scopes: scopes.length !== 1,
      };
    },
    ({ policies, resources, scopes }) => {
      setPolicyProviders(policies);
      setDisabledCreate({ resources, scopes });
    },
    [],
  );

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deletePermission",
    messageKey: t("deletePermissionConfirm", {
      permission: selectedPermission?.name,
    }),
    continueButtonVariant: ButtonVariant.danger,
    continueButtonLabel: "confirm",
    onConfirm: async () => {
      try {
        await adminClient.clients.delPermission({
          id: clientId,
          type: selectedPermission?.type!,
          permissionId: selectedPermission?.id!,
        });
        addAlert(t("permissionDeletedSuccess"), AlertVariant.success);
        refresh();
      } catch (error) {
        addError("permissionDeletedError", error);
      }
    },
  });

  if (!permissions) {
    return <KeycloakSpinner />;
  }

  const noData = permissions.length === 0;
  const searching = Object.keys(search).length !== 0;
  return (
    <PageSection variant="light" className="pf-v5-u-p-0">
      <DeleteConfirm />
      {(!noData || searching) && (
        <PaginatingTableToolbar
          count={permissions.length}
          first={first}
          max={max}
          onNextClick={setFirst}
          onPreviousClick={setFirst}
          onPerPageSelect={(first, max) => {
            setFirst(first);
            setMax(max);
          }}
          toolbarItem={
            <>
              <ToolbarItem>
                <SearchDropdown
                  types={policyProviders}
                  search={search}
                  onSearch={setSearch}
                  type="permission"
                />
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  onOpenChange={toggleCreate}
                  toggle={(ref) => (
                    <MenuToggle
                      ref={ref}
                      onClick={toggleCreate}
                      isDisabled={isDisabled}
                      variant="primary"
                      data-testid="permissionCreateDropdown"
                    >
                      {t("createPermission")}
                    </MenuToggle>
                  )}
                  isOpen={createOpen}
                >
                  <DropdownList>
                    <DropdownItem
                      data-testid="create-resource"
                      isDisabled={isDisabled || disabledCreate?.resources}
                      component="button"
                      onClick={() =>
                        navigate(
                          toNewPermission({
                            realm,
                            id: clientId,
                            permissionType: "resource",
                          }),
                        )
                      }
                    >
                      {t("createResourceBasedPermission")}
                    </DropdownItem>
                    <Divider />
                    <DropdownItem
                      data-testid="create-scope"
                      isDisabled={isDisabled || disabledCreate?.scopes}
                      component="button"
                      onClick={() =>
                        navigate(
                          toNewPermission({
                            realm,
                            id: clientId,
                            permissionType: "scope",
                          }),
                        )
                      }
                    >
                      {t("createScopeBasedPermission")}
                      {disabledCreate?.scopes && (
                        <Alert
                          className="pf-v5-u-mt-sm"
                          variant="warning"
                          isInline
                          isPlain
                          title={t("noScopeCreateHint")}
                        />
                      )}
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </>
          }
        >
          {!noData && (
            <Table aria-label={t("resources")} variant="compact">
              <Thead>
                <Tr>
                  <Th aria-hidden="true" />
                  <Th>{t("name")}</Th>
                  <Th>{t("type")}</Th>
                  <Th>{t("associatedPolicy")}</Th>
                  <Th>{t("description")}</Th>
                  <Th aria-hidden="true" />
                </Tr>
              </Thead>
              {permissions.map((permission, rowIndex) => (
                <Tbody key={permission.id} isExpanded={permission.isExpanded}>
                  <Tr>
                    <Td
                      expand={{
                        rowIndex,
                        isExpanded: permission.isExpanded,
                        onToggle: (_, rowIndex) => {
                          const rows = permissions.map((p, index) =>
                            index === rowIndex
                              ? { ...p, isExpanded: !p.isExpanded }
                              : p,
                          );
                          setPermissions(rows);
                        },
                      }}
                    />
                    <Td data-testid={`name-column-${permission.name}`}>
                      <Link
                        to={toPermissionDetails({
                          realm,
                          id: clientId,
                          permissionType: permission.type!,
                          permissionId: permission.id!,
                        })}
                      >
                        {permission.name}
                      </Link>
                    </Td>
                    <Td>
                      {
                        policyProviders?.find((p) => p.type === permission.type)
                          ?.name
                      }
                    </Td>
                    <Td>
                      <AssociatedPoliciesRenderer row={permission} />
                    </Td>
                    <Td>{permission.description || "—"}</Td>
                    <Td
                      actions={{
                        items: [
                          {
                            title: t("delete"),
                            onClick: async () => {
                              setSelectedPermission(permission);
                              toggleDeleteDialog();
                            },
                          },
                        ],
                      }}
                    ></Td>
                  </Tr>
                  <Tr
                    key={`child-${permission.id}`}
                    isExpanded={permission.isExpanded}
                  >
                    <Td />
                    <Td colSpan={5}>
                      <ExpandableRowContent>
                        {permission.isExpanded && (
                          <DescriptionList
                            isHorizontal
                            className="keycloak_resource_details"
                          >
                            <DetailDescriptionLink
                              name="associatedPolicy"
                              array={permission.associatedPolicies}
                              convert={(p) => p.name!}
                              link={(p) =>
                                toPolicyDetails({
                                  id: clientId,
                                  realm,
                                  policyId: p.id!,
                                  policyType: p.type!,
                                })
                              }
                            />
                          </DescriptionList>
                        )}
                      </ExpandableRowContent>
                    </Td>
                  </Tr>
                </Tbody>
              ))}
            </Table>
          )}
        </PaginatingTableToolbar>
      )}
      {noData && !searching && (
        <EmptyPermissionsState
          clientId={clientId}
          isResourceEnabled={!isDisabled && disabledCreate?.resources}
          isScopeEnabled={!isDisabled && disabledCreate?.scopes}
        />
      )}
      {noData && searching && (
        <ListEmptyState
          isSearchVariant
          message={t("noSearchResults")}
          instructions={t("noSearchResultsInstructions")}
        />
      )}
    </PageSection>
  );
};
