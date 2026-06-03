/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/policy/Role.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { HelpItem, useFetch } from "../../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Checkbox as UICheckbox } from "@metronome/ui/components/checkbox";
import { cn } from "@metronome/ui/lib/utils";
import { MinusCircle as MinusCircleIcon } from "@phosphor-icons/react"
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table/table";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../../admin-client";
import { DefaultSwitchControl } from "../../../switch-control";
import {
  AddRoleButton,
  AddRoleMappingModal,
  FilterType,
} from "../../../role-mapping/add-role-mapping-modal";
import { Row, ServiceRole } from "../../../role-mapping/role-mapping";
import type { RequiredIdValue } from "./client-scope";


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
const Checkbox = ({ id, label, description, isChecked, isDisabled, onChange, name, ...props }: any) => (
  <div className="flex items-start gap-2">
    <UICheckbox id={id} name={name} checked={isChecked} disabled={isDisabled}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
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

export const Role = () => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { control, getValues, setValue } = useFormContext<{
    roles?: RequiredIdValue[];
    fetchRoles?: boolean;
  }>();
  const values = getValues("roles");

  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("clients");

  const [selectedRoles, setSelectedRoles] = useState<Row[]>([]);

  useFetch(
    async () => {
      if (values && values.length > 0) {
        const roles = await Promise.all(
          values.map((r) => adminClient.roles.findOneById({ id: r.id })),
        );
        return Promise.all(
          roles.map(async (role) => ({
            role: role!,
            client: role!.clientRole
              ? await adminClient.clients.findOne({
                  id: role?.containerId!,
                })
              : undefined,
          })),
        );
      }
      return Promise.resolve([]);
    },
    setSelectedRoles,
    [],
  );

  return (
    <>
      <FormGroup
        label={t("roles")}
        labelIcon={
          <HelpItem helpText={t("policyRolesHelp")} fieldLabelId="roles" />
        }
        fieldId="roles"
      >
        <Controller
          name="roles"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <>
              {open && (
                <AddRoleMappingModal
                  id="role"
                  type="roles"
                  title={t("assignRole")}
                  filterType={filterType}
                  onAssign={(rows) => {
                    field.onChange([
                      ...(field.value || []),
                      ...rows.map((row) => ({ id: row.role.id })),
                    ]);
                    setSelectedRoles([...selectedRoles, ...rows]);
                    setOpen(false);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                />
              )}
              <AddRoleButton
                data-testid="select-role-button"
                variant="secondary"
                onFilerTypeChange={(type) => {
                  setFilterType(type);
                  setOpen(true);
                }}
              />
            </>
          )}
        />
        {selectedRoles.length > 0 && (
          <Table variant="compact">
            <Thead>
              <Tr>
                <Th>{t("roles")}</Th>
                <Th>{t("required")}</Th>
                <Th aria-hidden="true" />
              </Tr>
            </Thead>
            <Tbody>
              {selectedRoles.map((row, index) => (
                <Tr key={row.role.id}>
                  <Td>
                    <ServiceRole role={row.role} client={row.client} />
                  </Td>
                  <Td>
                    <Controller
                      name={`roles.${index}.required`}
                      defaultValue={false}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="required"
                          data-testid="standard"
                          name="required"
                          isChecked={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Td>
                  <Td>
                    <Button
                      variant="link"
                      className="keycloak__client-authorization__policy-row-remove"
                      icon={<MinusCircleIcon />}
                      onClick={() => {
                        setValue("roles", [
                          ...(values || []).filter((s) => s.id !== row.role.id),
                        ]);
                        setSelectedRoles([
                          ...selectedRoles.filter(
                            (s) => s.role.id !== row.role.id,
                          ),
                        ]);
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </FormGroup>
      <DefaultSwitchControl
        name="fetchRoles"
        label={t("fetchRoles")}
        labelIcon={t("fetchRolesHelp")}
      />
    </>
  );
};
