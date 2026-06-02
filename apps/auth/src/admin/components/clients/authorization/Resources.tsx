/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/Resources.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import type ResourceRepresentation from "@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation";
import {
  ListEmptyState,
  PaginatingTableToolbar,
  useAlerts,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
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
const TableText = ({ children }: any) => (
  <span className="block truncate">{children}</span>
);
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { useConfirmDialog } from "../../confirm-dialog/ConfirmDialog";
import { KeycloakSpinner } from "../../../../shared/keycloak-ui-shared";
import { useRealm } from "../../../context/realm-context/realm-context";
import { toNewPermission } from "../../../lib/clients";
import { toCreateResource } from "../../../lib/clients";
import { toResourceDetails } from "../../../lib/clients";
import { DetailCell } from "./DetailCell";
import { MoreLabel } from "./MoreLabel";
import { SearchDropdown, SearchForm } from "./SearchDropdown";


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

type ResourcesProps = {
  clientId: string;
  isDisabled?: boolean;
};

type ExpandableResourceRepresentation = ResourceRepresentation & {
  isExpanded: boolean;
};

const UriRenderer = ({ row }: { row: ResourceRepresentation }) => (
  <TableText wrapModifier="truncate">
    {row.uris?.[0]} <MoreLabel array={row.uris} />
  </TableText>
);

export const AuthorizationResources = ({
  clientId,
  isDisabled = false,
}: ResourcesProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addAlert, addError } = useAlerts();
  const { realm } = useRealm();

  const [resources, setResources] =
    useState<ExpandableResourceRepresentation[]>();
  const [selectedResource, setSelectedResource] =
    useState<ResourceRepresentation>();
  const [permissions, setPermission] = useState<PolicyRepresentation[]>();

  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const [search, setSearch] = useState<SearchForm>({});

  useFetch(
    () => {
      const params = {
        first,
        max: max + 1,
        deep: false,
        ...search,
      };
      return adminClient.clients.listResources({
        ...params,
        id: clientId,
      });
    },
    (resources) =>
      setResources(
        resources.map((resource) => ({ ...resource, isExpanded: false })),
      ),
    [key, search, first, max],
  );

  const fetchPermissions = async (id: string) => {
    return adminClient.clients.listPermissionsByResource({
      id: clientId,
      resourceId: id,
    });
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deleteResource",
    children: (
      <>
        {t("deleteResourceConfirm")}
        {permissions?.length && (
          <Alert
            variant="warning"
            isInline
            isPlain
            title={t("deleteResourceWarning")}
            className="pf-v5-u-pt-lg"
          >
            <p className="pf-v5-u-pt-xs">
              {permissions.map((permission) => (
                <strong key={permission.id} className="pf-v5-u-pr-md">
                  {permission.name}
                </strong>
              ))}
            </p>
          </Alert>
        )}
      </>
    ),
    continueButtonLabel: "confirm",
    onConfirm: async () => {
      try {
        await adminClient.clients.delResource({
          id: clientId,
          resourceId: selectedResource?._id!,
        });
        addAlert(t("resourceDeletedSuccess"), AlertVariant.success);

        if (resources?.length === 1 && first > 0) {
          // Go back one page. Changing 'first' will automatically re-trigger
          // the useFetch hook, so we don't need to call refresh() here.
          setFirst(first - max);
        } else {
          refresh();
        }
      } catch (error) {
        addError("resourceDeletedError", error);
      }
    },
  });

  if (!resources) {
    return <KeycloakSpinner />;
  }

  const noData = resources.length === 0;
  const searching = Object.keys(search).length !== 0;
  return (
    <PageSection variant="light" className="pf-v5-u-p-0">
      <DeleteConfirm />
      {(!noData || searching) && (
        <PaginatingTableToolbar
          count={resources.length}
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
                  search={search}
                  onSearch={setSearch}
                  type="resource"
                />
              </ToolbarItem>

              <ToolbarItem>
                <Button
                  data-testid="createResource"
                  isDisabled={isDisabled}
                  component={(props) => (
                    <Link
                      {...props}
                      to={toCreateResource({ realm, id: clientId })}
                    />
                  )}
                >
                  {t("createResource")}
                </Button>
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
                  <Th>{t("displayName")}</Th>
                  <Th>{t("type")}</Th>
                  <Th>{t("owner")}</Th>
                  <Th>{t("uris")}</Th>
                  {!isDisabled && (
                    <>
                      <Th aria-hidden="true" />
                      <Th aria-hidden="true" />
                    </>
                  )}
                </Tr>
              </Thead>
              {resources.map((resource, rowIndex) => (
                <Tbody key={resource._id} isExpanded={resource.isExpanded}>
                  <Tr>
                    <Td
                      expand={{
                        rowIndex,
                        isExpanded: resource.isExpanded,
                        onToggle: (_, rowIndex) => {
                          const rows = resources.map((resource, index) =>
                            index === rowIndex
                              ? {
                                  ...resource,
                                  isExpanded: !resource.isExpanded,
                                }
                              : resource,
                          );
                          setResources(rows);
                        },
                      }}
                    />
                    <Td data-testid={`name-column-${resource.name}`}>
                      <TableText wrapModifier="truncate">
                        <Link
                          to={toResourceDetails({
                            realm,
                            id: clientId,
                            resourceId: resource._id!,
                          })}
                        >
                          {resource.name}
                        </Link>
                      </TableText>
                    </Td>
                    <Td>
                      <TableText wrapModifier="truncate">
                        {resource.displayName}
                      </TableText>
                    </Td>
                    <Td>
                      <TableText wrapModifier="truncate">
                        {resource.type}
                      </TableText>
                    </Td>
                    <Td>
                      <TableText wrapModifier="truncate">
                        {resource.owner?.name}
                      </TableText>
                    </Td>
                    <Td>
                      <UriRenderer row={resource} />
                    </Td>
                    {!isDisabled && (
                      <>
                        <Td width={10}>
                          <Button
                            variant="link"
                            component={(props) => (
                              <Link
                                {...props}
                                to={toNewPermission({
                                  realm,
                                  id: clientId,
                                  permissionType: "resource",
                                  selectedId: resource._id,
                                })}
                              />
                            )}
                          >
                            {t("createPermission")}
                          </Button>
                        </Td>
                        <Td
                          actions={{
                            items: [
                              {
                                title: t("delete"),
                                onClick: async () => {
                                  setSelectedResource(resource);
                                  setPermission(
                                    await fetchPermissions(resource._id!),
                                  );
                                  toggleDeleteDialog();
                                },
                              },
                            ],
                          }}
                        />
                      </>
                    )}
                  </Tr>
                  <Tr
                    key={`child-${resource._id}`}
                    isExpanded={resource.isExpanded}
                  >
                    <Td />
                    <Td colSpan={4}>
                      <ExpandableRowContent>
                        {resource.isExpanded && (
                          <DetailCell
                            clientId={clientId}
                            id={resource._id!}
                            uris={resource.uris}
                          />
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
      {noData && searching && (
        <ListEmptyState
          isSearchVariant
          message={t("noSearchResults")}
          instructions={t("noSearchResultsInstructions")}
        />
      )}
      {noData && !searching && (
        <ListEmptyState
          message={t("emptyResources")}
          instructions={t("emptyResourcesInstructions")}
          isDisabled={isDisabled}
          primaryActionText={t("createResource")}
          onPrimaryAction={() =>
            navigate(toCreateResource({ realm, id: clientId }))
          }
        />
      )}
    </PageSection>
  );
};
