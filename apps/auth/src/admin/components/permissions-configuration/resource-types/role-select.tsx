/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/permissions-configuration/resource-types/RoleSelect.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  FormErrorText,
  HelpItem,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
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
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import {
  AddRoleButton,
  AddRoleMappingModal,
  FilterType,
} from "../../role-mapping/add-role-mapping-modal";
import { Row, ServiceRole } from "../../role-mapping/role-mapping";


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

type RoleSelectorProps = {
  name: string;
  isRadio?: boolean;
};

export const RoleSelect = ({ name, isRadio = false }: RoleSelectorProps) => {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const {
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<{ [key: string]: string[] }>();
  const values = getValues(name) || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Row[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("clients");

  useFetch(
    async () => {
      if (values.length > 0) {
        const roles = await Promise.all(
          values.map((id) => adminClient.roles.findOneById({ id })),
        );
        return Promise.all(
          roles.map(async (role) => ({
            role: role!,
            client: role!.clientRole
              ? await adminClient.clients.findOne({ id: role?.containerId! })
              : undefined,
          })),
        );
      }
      return [];
    },
    setSelectedRoles,
    [],
  );

  return (
    <FormGroup
      label={isRadio ? t("role") : t("roles")}
      labelIcon={
        <HelpItem
          helpText={isRadio ? t("selectRole") : t("policyRolesHelp")}
          fieldLabelId="roles"
        />
      }
      fieldId={name}
      isRequired
    >
      {isModalOpen && (
        <AddRoleMappingModal
          id="role"
          type="roles"
          title={t("selectRole")}
          actionLabel={t("select")}
          isRadio={isRadio}
          onAssign={(rows) => {
            setValue(name, [
              ...(!isRadio ? values : []),
              ...rows
                .filter((row) => row.role.id !== undefined)
                .map((row) => row.role.id!),
            ]);

            setSelectedRoles(isRadio ? rows : [...selectedRoles, ...rows]);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
          filterType={filterType}
        />
      )}
      <AddRoleButton
        label={isRadio ? t("selectRole") : t("addRoles")}
        data-testid="select-role-button"
        variant="secondary"
        onFilerTypeChange={(type) => {
          setFilterType(type);
          setIsModalOpen(true);
        }}
      />
      {selectedRoles.length > 0 && (
        <Table variant="compact">
          <Thead>
            <Tr>
              <Th>{t("roles")}</Th>
              <Th aria-hidden="true" />
            </Tr>
          </Thead>
          <Tbody>
            {selectedRoles.map((row) => (
              <Tr key={row.role.id}>
                <Td>
                  <ServiceRole role={row.role} client={row.client} />
                </Td>
                <Td>
                  <Button
                    variant="link"
                    className="keycloak__client-authorization__policy-row-remove"
                    icon={<MinusCircleIcon />}
                    onClick={() => {
                      setValue(
                        name,
                        values.filter((id) => id !== row.role.id),
                      );
                      setSelectedRoles(
                        selectedRoles.filter((s) => s.role.id !== row.role.id),
                      );
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      {errors[name] && <FormErrorText message={t("requiredRoles")} />}
    </FormGroup>
  );
};
