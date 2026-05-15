/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/Scopes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import type ScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation";
import {
  ListEmptyState,
  PaginatingTableToolbar,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table";
const ExpandableRowContent = ({ children }: any) => <>{children}</>;
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { KeycloakSpinner } from "../../../shared/keycloak-ui-shared";
import { useRealm } from "../../context/realm-context/RealmContext";
import useToggle from "../../utils/useToggle";
import { toNewPermission } from "../paths/NewPermission";
import { toNewScope } from "../paths/NewScope";
import { toPermissionDetails } from "../paths/PermissionDetails";
import { toResourceDetails } from "../paths/Resource";
import { toScopeDetails } from "../paths/Scope";
import { DeleteScopeDialog } from "./DeleteScopeDialog";
import { DetailDescriptionLink } from "./DetailDescription";


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
const DescriptionList = ({ isHorizontal, columnModifier, children, ...props }: any) => (
  <dl className={cn("grid gap-y-2 text-sm",
    isHorizontal && "grid-cols-[max-content_1fr] gap-x-4",
    (props as any).className)} {...props}>
    {children}
  </dl>
);
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

type ScopesProps = {
  clientId: string;
  isDisabled?: boolean;
};

export type PermissionScopeRepresentation = ScopeRepresentation & {
  permissions?: PolicyRepresentation[];
  isLoaded: boolean;
};

type ExpandableRow = {
  id: string;
  isExpanded: boolean;
};

export const AuthorizationScopes = ({
  clientId,
  isDisabled = false,
}: ScopesProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { realm } = useRealm();

  const [deleteDialog, toggleDeleteDialog] = useToggle();
  const [scopes, setScopes] = useState<PermissionScopeRepresentation[]>();
  const [selectedScope, setSelectedScope] =
    useState<PermissionScopeRepresentation>();
  const [collapsed, setCollapsed] = useState<ExpandableRow[]>([]);

  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const [search, setSearch] = useState("");

  useFetch(
    () => {
      const params = {
        first,
        max: max + 1,
        deep: false,
        name: search,
      };
      return adminClient.clients.listAllScopes({
        ...params,
        id: clientId,
      });
    },
    (scopes) => {
      setScopes(scopes.map((s) => ({ ...s, isLoaded: false })));
      setCollapsed(scopes.map((s) => ({ id: s.id!, isExpanded: false })));
    },
    [key, search, first, max],
  );

  const getScope = (id: string) => scopes?.find((scope) => scope.id === id)!;
  const isExpanded = (id: string | undefined) =>
    collapsed.find((c) => c.id === id)?.isExpanded || false;

  useFetch(
    () => {
      const newlyOpened = collapsed
        .filter((row) => row.isExpanded)
        .map(({ id }) => getScope(id))
        .filter((s) => !s.isLoaded);

      return Promise.all(
        newlyOpened.map(async (scope) => {
          const [resources, permissions] = await Promise.all([
            adminClient.clients.listAllResourcesByScope({
              id: clientId,
              scopeId: scope.id!,
            }),
            adminClient.clients.listAllPermissionsByScope({
              id: clientId,
              scopeId: scope.id!,
            }),
          ]);

          return {
            ...scope,
            resources,
            permissions,
            isLoaded: true,
          };
        }),
      );
    },
    (resourcesScopes) => {
      let result = [...(scopes || [])];
      resourcesScopes.forEach((resourceScope) => {
        const index = scopes?.findIndex(
          (scope) => resourceScope.id === scope.id,
        )!;
        result = [
          ...result.slice(0, index),
          resourceScope,
          ...result.slice(index + 1),
        ];
      });

      setScopes(result);
    },
    [collapsed],
  );

  if (!scopes) {
    return <KeycloakSpinner />;
  }

  const noData = scopes.length === 0;
  const searching = search !== "";
  return (
    <PageSection variant="light" className="pf-v5-u-p-0">
      <DeleteScopeDialog
        clientId={clientId}
        open={deleteDialog}
        toggleDialog={toggleDeleteDialog}
        selectedScope={selectedScope}
        refresh={refresh}
      />
      {(!noData || searching) && (
        <PaginatingTableToolbar
          count={scopes.length}
          first={first}
          max={max}
          onNextClick={setFirst}
          onPreviousClick={setFirst}
          onPerPageSelect={(first, max) => {
            setFirst(first);
            setMax(max);
          }}
          inputGroupName="search"
          inputGroupPlaceholder={t("searchByName")}
          inputGroupOnEnter={setSearch}
          toolbarItem={
            <ToolbarItem>
              <Button
                data-testid="createAuthorizationScope"
                component={(props) => (
                  <Link {...props} to={toNewScope({ realm, id: clientId })} />
                )}
              >
                {t("createAuthorizationScope")}
              </Button>
            </ToolbarItem>
          }
        >
          {!noData && (
            <Table aria-label={t("scopes")} variant="compact">
              <Thead>
                <Tr>
                  <Th aria-hidden="true" />
                  <Th>{t("name")}</Th>
                  <Th>{t("displayName")}</Th>
                  <Th aria-hidden="true" />
                  <Th aria-hidden="true" />
                </Tr>
              </Thead>
              {scopes.map((scope, rowIndex) => (
                <Tbody key={scope.id} isExpanded={isExpanded(scope.id)}>
                  <Tr>
                    <Td
                      expand={{
                        rowIndex,
                        isExpanded: isExpanded(scope.id),
                        onToggle: (_event, index, isExpanded) => {
                          setCollapsed([
                            ...collapsed.slice(0, index),
                            { id: scope.id!, isExpanded },
                            ...collapsed.slice(index + 1),
                          ]);
                        },
                      }}
                    />
                    <Td data-testid={`name-column-${scope.name}`}>
                      <Link
                        to={toScopeDetails({
                          realm,
                          id: clientId,
                          scopeId: scope.id!,
                        })}
                      >
                        {scope.name}
                      </Link>
                    </Td>
                    <Td>{scope.displayName}</Td>
                    <Td width={10}>
                      <Button
                        variant="link"
                        component={(props) => (
                          <Link
                            {...props}
                            to={toNewPermission({
                              realm,
                              id: clientId,
                              permissionType: "scope",
                              selectedId: scope.id,
                            })}
                          />
                        )}
                      >
                        {t("createPermission")}
                      </Button>
                    </Td>
                    <Td
                      isActionCell
                      actions={{
                        items: [
                          {
                            title: t("delete"),
                            onClick: () => {
                              setSelectedScope(scope);
                              toggleDeleteDialog();
                            },
                          },
                        ],
                      }}
                    />
                  </Tr>
                  <Tr
                    key={`child-${scope.id}`}
                    isExpanded={isExpanded(scope.id)}
                  >
                    <Td />
                    <Td colSpan={4}>
                      <ExpandableRowContent>
                        {isExpanded(scope.id) && scope.isLoaded ? (
                          <DescriptionList
                            isHorizontal
                            className="keycloak_resource_details"
                          >
                            <DetailDescriptionLink
                              name="resources"
                              array={scope.resources}
                              convert={(r) => r.name!}
                              link={(r) =>
                                toResourceDetails({
                                  id: clientId,
                                  realm,
                                  resourceId: r._id!,
                                })
                              }
                            />
                            <DetailDescriptionLink
                              name="associatedPermissions"
                              array={scope.permissions}
                              convert={(p) => p.name!}
                              link={(p) =>
                                toPermissionDetails({
                                  id: clientId,
                                  realm,
                                  permissionId: p.id!,
                                  permissionType: p.type!,
                                })
                              }
                            />
                          </DescriptionList>
                        ) : (
                          <KeycloakSpinner />
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
        <ListEmptyState
          message={t("emptyAuthorizationScopes")}
          instructions={t("emptyAuthorizationInstructions")}
          isDisabled={isDisabled}
          onPrimaryAction={() => navigate(toNewScope({ id: clientId, realm }))}
          primaryActionText={t("createAuthorizationScope")}
        />
      )}
      {noData && searching && (
        <ListEmptyState
          isSearchVariant
          isDisabled={isDisabled}
          message={t("noSearchResults")}
          instructions={t("noSearchResultsInstructions")}
        />
      )}
    </PageSection>
  );
};
