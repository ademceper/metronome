/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/permission-configuration/AssignedPolicies.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import { FormErrorText, HelpItem, useFetch } from "../../../../shared/keycloak-ui-shared";
import { Action, DataTable } from "@metronome/ui/components/data-table";
import { ListEmptyState } from "@metronome/ui/components/list-empty-state";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { NewPermissionPolicyDialog } from "./NewPermissionPolicyDialog";
import PolicyProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyProviderRepresentation";
import { ExistingPoliciesDialog } from "./ExistingPoliciesDialog";
import { CaretDown as CaretDownIcon, Funnel as FilterIcon } from "@phosphor-icons/react"
import { capitalize, sortBy } from "lodash-es";
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
const FormGroup = ({ label, fieldId, isRequired, labelIcon, helperText, helperTextInvalid, validated, children, ...props }: any) => (
  <div className={cn("space-y-1.5", (props as any).className)}>
    {label ? (
      <label htmlFor={fieldId} className="font-medium text-sm">
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
        {labelIcon}
      </label>
    ) : null}
    {children}
    {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
    {helperTextInvalid ? <p className="text-destructive text-xs">{helperTextInvalid}</p> : null}
  </div>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";

type IRowData = any;

type AssignedPoliciesProps = {
  permissionClientId: string;
  providers: PolicyProviderRepresentation[];
  policies: PolicyRepresentation[] | undefined;
  resourceType: string;
};

type AssignedPolicyForm = {
  policies?: { id: string; type?: string }[];
};

export const AssignedPolicies = ({
  permissionClientId,
  providers,
  policies,
  resourceType,
}: AssignedPoliciesProps) => {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<AssignedPolicyForm>();
  const values = getValues("policies");
  const [existingPoliciesOpen, setExistingPoliciesOpen] = useState(false);
  const [newPolicyOpen, setNewPolicyOpen] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState<
    PolicyRepresentation[]
  >([]);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [isFilterTypeDropdownOpen, toggleIsFilterTypeDropdownOpen] =
    useToggle();

  useFetch(
    () => {
      if (values && values.length > 0)
        return Promise.all(
          values.map((p) =>
            adminClient.clients.findOnePolicyWithType({
              id: permissionClientId,
              type: p.type!,
              policyId: p.id,
            }),
          ),
        );
      return Promise.resolve([]);
    },
    (policies) => {
      const filteredPolicy = policies.filter((p) => p) as [];
      setSelectedPolicies(filteredPolicy);
    },
    [policies],
  );

  const sortedProviders = sortBy(
    providers
      ? providers
          .filter((p) => p.type !== "resource" && p.type !== "scope")
          .map((provider) => provider.name)
      : [],
  );

  const assign = async (policies: { policy: PolicyRepresentation }[]) => {
    const assignedPolicies = policies.map(({ policy }) => ({
      id: policy.id!,
    }));

    setValue("policies", [
      ...(getValues("policies") || []),
      ...assignedPolicies,
    ]);
    await trigger("policies");
    setSelectedPolicies([
      ...selectedPolicies,
      ...policies.map(({ policy }) => policy),
    ]);
  };

  const unAssign = (policy: PolicyRepresentation) => {
    const updatedPolicies = selectedPolicies.filter(
      (selectedPolicy) => selectedPolicy.id !== policy.id,
    );
    setSelectedPolicies(updatedPolicies);
    setValue(
      "policies",
      updatedPolicies.map((policy) => ({
        id: policy.id!,
        name: policy.name!,
        type: policy.type!,
        description: policy.description!,
      })),
    );
  };

  const filteredPolicies = filterType
    ? selectedPolicies.filter(
        (policy) => capitalize(policy.type) === filterType,
      )
    : selectedPolicies;

  return (
    <FormGroup
      label={t("policies")}
      labelIcon={
        <HelpItem
          helpText={t("permissionPoliciesHelp")}
          fieldLabelId="policies"
        />
      }
      fieldId="policies"
      isRequired
    >
      <Controller
        name="policies"
        control={control}
        defaultValue={[]}
        rules={{
          validate: (value?: { id: string }[]) => {
            if (!value || value.length === 0) return false;
            return value.every(({ id }) => id && id.trim().length > 0);
          },
        }}
        render={() => (
          <>
            {existingPoliciesOpen && (
              <ExistingPoliciesDialog
                permissionClientId={permissionClientId}
                open={existingPoliciesOpen}
                toggleDialog={() =>
                  setExistingPoliciesOpen(!existingPoliciesOpen)
                }
                onAssign={assign}
              />
            )}
            {newPolicyOpen && (
              <NewPermissionPolicyDialog
                toggleDialog={() => setNewPolicyOpen(!newPolicyOpen)}
                permissionClientId={permissionClientId}
                providers={providers!}
                policies={policies!}
                resourceType={resourceType}
                onAssign={async (newPolicy) => {
                  await assign([{ policy: newPolicy }]);
                }}
              />
            )}
            <Button
              data-testid="select-assignedPolicy-button"
              variant="secondary"
              onClick={() => {
                setExistingPoliciesOpen(true);
              }}
            >
              {t("assignExistingPolicies")}
            </Button>
            <Button
              data-testid="select-createNewPolicy-button"
              className="pf-v5-u-ml-md"
              variant="secondary"
              onClick={() => {
                setNewPolicyOpen(true);
              }}
            >
              {t("createNewPolicy")}
            </Button>
          </>
        )}
      />
      {selectedPolicies.length > 0 && (
        <DataTable
          t={t}
          loader={filteredPolicies}
          ariaLabelKey={t("policies")}
          searchPlaceholderKey={t("searchClientAuthorizationPolicy")}
          isSearching={true}
          searchTypeComponent={
            <Dropdown
              onSelect={(event, value) => {
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
                  {filterType ? capitalize(filterType) : t("allTypes")}
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
                {sortedProviders.map((name) => (
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
          actionResolver={(rowData: IRowData) => [
            {
              title: t("unAssignPolicy"),
              onClick: () => unAssign(rowData.data as PolicyRepresentation),
            } as Action<PolicyRepresentation>,
          ]}
          columns={[
            { name: "name", displayKey: t("name") },
            {
              name: "type",
              displayKey: t("type"),
              cellFormatters: [(value) => capitalize(String(value || ""))],
            },
            { name: "description", displayKey: t("description") },
          ]}
          emptyState={
            <ListEmptyState
              message={t("emptyAssignExistingPolicies")}
              instructions={t("emptyAssignExistingPoliciesInstructions")}
            />
          }
        />
      )}
      {errors.policies && <FormErrorText message={t("requiredPolicies")} />}
    </FormGroup>
  );
};
