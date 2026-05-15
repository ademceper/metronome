/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/Policies.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type PolicyProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyProviderRepresentation";
import type PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { useConfirmDialog } from "../../confirm-dialog/ConfirmDialog";
import { KeycloakSpinner } from "../../../../shared/keycloak-ui-shared";
import { useRealm } from "../../../context/realm-context/RealmContext";
import { toUpperCase } from "../../../util";
import useToggle from "../../../utils/useToggle";
import { toCreatePolicy } from "../../../lib/clients";
import { toPermissionDetails } from "../../../lib/clients";
import { toPolicyDetails } from "../../../lib/clients";
import { DetailDescriptionLink } from "./DetailDescription";
import { MoreLabel } from "./MoreLabel";
import { NewPolicyDialog } from "./NewPolicyDialog";
import { SearchDropdown, SearchForm } from "./SearchDropdown";
import { useIsAdminPermissionsClient } from "../../../utils/useIsAdminPermissionsClient";
import { toCreatePermissionPolicy } from "../../../lib/permissions-configuration";
import { toPermissionPolicyDetails } from "../../../lib/permissions-configuration";


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

type PoliciesProps = {
  clientId: string;
  isDisabled?: boolean;
};

type ExpandablePolicyRepresentation = PolicyRepresentation & {
  dependentPolicies?: PolicyRepresentation[];
  isExpanded: boolean;
};

const DependentPoliciesRenderer = ({
  row,
}: {
  row: ExpandablePolicyRepresentation;
}) => {
  return (
    <>
      {row.dependentPolicies?.[0]?.name}{" "}
      <MoreLabel array={row.dependentPolicies} />
    </>
  );
};

export const AuthorizationPolicies = ({
  clientId,
  isDisabled = false,
}: PoliciesProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const { realm } = useRealm();
  const navigate = useNavigate();

  const [policies, setPolicies] = useState<ExpandablePolicyRepresentation[]>();
  const [selectedPolicy, setSelectedPolicy] =
    useState<ExpandablePolicyRepresentation>();
  const [policyProviders, setPolicyProviders] =
    useState<PolicyProviderRepresentation[]>();

  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const [search, setSearch] = useState<SearchForm>({});
  const [newDialog, toggleDialog] = useToggle();
  const isAdminPermissionsClient = useIsAdminPermissionsClient(clientId);

  useFetch(
    async () => {
      const policies = await adminClient.clients.listPolicies({
        first,
        max: max + 1,
        id: clientId,
        permission: "false",
        ...search,
      });

      return await Promise.all([
        adminClient.clients.listPolicyProviders({ id: clientId }),
        ...(policies || []).map(async (policy) => {
          const dependentPolicies =
            await adminClient.clients.listDependentPolicies({
              id: clientId,
              policyId: policy.id!,
            });

          return {
            ...policy,
            dependentPolicies,
            isExpanded: false,
          };
        }),
      ]);
    },
    ([providers, ...policies]) => {
      setPolicyProviders(
        providers.filter((p) => p.type !== "resource" && p.type !== "scope"),
      );
      setPolicies(policies);
    },
    [key, search, first, max],
  );

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "deletePolicy",
    children: (
      <>
        {t("deletePolicyConfirm")}
        {selectedPolicy?.dependentPolicies &&
          selectedPolicy.dependentPolicies.length > 0 && (
            <Alert
              variant="warning"
              isInline
              isPlain
              component="p"
              title={t("deletePolicyWarning")}
              className="pf-v5-u-pt-lg"
            >
              <p className="pf-v5-u-pt-xs">
                {selectedPolicy.dependentPolicies.map((policy) => (
                  <strong key={policy.id} className="pf-v5-u-pr-md">
                    {policy.name}
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
        await adminClient.clients.delPolicy({
          id: clientId,
          policyId: selectedPolicy?.id!,
        });
        addAlert(t("policyDeletedSuccess"), AlertVariant.success);
        refresh();
      } catch (error) {
        addError("policyDeletedError", error);
      }
    },
  });

  if (!policies) {
    return <KeycloakSpinner />;
  }

  const noData = policies.length === 0;
  const searching = Object.keys(search).length !== 0;
  return (
    <PageSection variant="light" className="pf-v5-u-p-0">
      <DeleteConfirm />
      {(!noData || searching) && (
        <>
          {newDialog && (
            <NewPolicyDialog
              policyProviders={policyProviders}
              onSelect={(p) =>
                navigate(
                  isAdminPermissionsClient
                    ? toCreatePermissionPolicy({
                        realm,
                        permissionClientId: clientId,
                        policyType: p.type!,
                      })
                    : toCreatePolicy({
                        id: clientId,
                        realm,
                        policyType: p.type!,
                      }),
                )
              }
              toggleDialog={toggleDialog}
            />
          )}
          <PaginatingTableToolbar
            count={policies.length}
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
                    type="policy"
                  />
                </ToolbarItem>
                <ToolbarItem>
                  <Button
                    data-testid="createPolicy"
                    onClick={() => {
                      toggleDialog();
                    }}
                    isDisabled={isDisabled}
                  >
                    {isAdminPermissionsClient
                      ? t("createPermissionPolicy")
                      : t("createPolicy")}
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
                    <Th>{t("type")}</Th>
                    <Th>{t("dependentPermission")}</Th>
                    <Th>{t("description")}</Th>
                    <Th aria-hidden="true" />
                  </Tr>
                </Thead>
                {policies.map((policy, rowIndex) => (
                  <Tbody key={policy.id} isExpanded={policy.isExpanded}>
                    <Tr>
                      <Td
                        expand={{
                          rowIndex,
                          isExpanded: policy.isExpanded,
                          onToggle: (_, rowIndex) => {
                            const rows = policies.map((policy, index) =>
                              index === rowIndex
                                ? { ...policy, isExpanded: !policy.isExpanded }
                                : policy,
                            );
                            setPolicies(rows);
                          },
                        }}
                      />
                      <Td data-testid={`name-column-${policy.name}`}>
                        {isAdminPermissionsClient ? (
                          <Link
                            to={toPermissionPolicyDetails({
                              realm,
                              permissionClientId: clientId,
                              policyId: policy.id!,
                              policyType: policy.type!,
                            })}
                          >
                            {policy.name}
                          </Link>
                        ) : (
                          <Link
                            to={toPolicyDetails({
                              realm,
                              id: clientId,
                              policyType: policy.type!,
                              policyId: policy.id!,
                            })}
                          >
                            {policy.name}
                          </Link>
                        )}
                      </Td>
                      <Td>{toUpperCase(policy.type!)}</Td>
                      <Td>
                        <DependentPoliciesRenderer row={policy} />
                      </Td>
                      <Td>{policy.description}</Td>
                      {!isDisabled && (
                        <Td
                          actions={{
                            items: [
                              {
                                title: t("delete"),
                                onClick: () => {
                                  setSelectedPolicy(policy);
                                  toggleDeleteDialog();
                                },
                              },
                            ],
                          }}
                        />
                      )}
                    </Tr>
                    <Tr
                      key={`child-${policy.id}`}
                      isExpanded={policy.isExpanded}
                    >
                      <Td />
                      <Td colSpan={3 + (isDisabled ? 0 : 1)}>
                        <ExpandableRowContent>
                          {policy.isExpanded && !isAdminPermissionsClient && (
                            <DescriptionList
                              isHorizontal
                              className="keycloak_resource_details"
                            >
                              <DetailDescriptionLink
                                name="dependentPermission"
                                array={policy.dependentPolicies}
                                convert={(p) => p.name!}
                                link={(permission) =>
                                  toPermissionDetails({
                                    realm,
                                    id: clientId,
                                    permissionId: permission.id!,
                                    permissionType: permission.type!,
                                  })
                                }
                              />
                            </DescriptionList>
                          )}
                          {policy.isExpanded && isAdminPermissionsClient && (
                            <>
                              <Th>{t("dependentPermission")}</Th>
                              {policy.dependentPolicies!.map(
                                (dependentPolicy, index) => (
                                  <Td key={index}>
                                    <span style={{ marginLeft: "8px" }}>
                                      {dependentPolicy.name}
                                    </span>
                                  </Td>
                                ),
                              )}
                            </>
                          )}
                        </ExpandableRowContent>
                      </Td>
                    </Tr>
                  </Tbody>
                ))}
              </Table>
            )}
          </PaginatingTableToolbar>
        </>
      )}
      {noData && searching && (
        <ListEmptyState
          isSearchVariant
          isDisabled={isDisabled}
          message={t("noSearchResults")}
          instructions={t("noSearchResultsInstructions")}
        />
      )}
      {noData && !searching && (
        <>
          {newDialog && (
            <NewPolicyDialog
              policyProviders={policyProviders?.filter(
                (p) => p.type !== "aggregate",
              )}
              onSelect={(p) =>
                navigate(
                  isAdminPermissionsClient
                    ? toCreatePermissionPolicy({
                        realm,
                        permissionClientId: clientId,
                        policyType: p.type!,
                      })
                    : toCreatePolicy({
                        id: clientId,
                        realm,
                        policyType: p.type!,
                      }),
                )
              }
              toggleDialog={toggleDialog}
            />
          )}
          <ListEmptyState
            message={t("emptyPolicies")}
            instructions={
              isAdminPermissionsClient
                ? t("emptyPermissionPoliciesInstructions")
                : t("emptyPoliciesInstructions")
            }
            isDisabled={isDisabled}
            primaryActionText={
              isAdminPermissionsClient
                ? t("createPermissionPolicy")
                : t("createPolicy")
            }
            onPrimaryAction={() => toggleDialog()}
          />
        </>
      )}
    </PageSection>
  );
};
