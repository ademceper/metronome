/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/RoleComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { FormErrorText, HelpItem } from "../../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useToggle from "../../utils/useToggle";
import {
  AddRoleButton,
  AddRoleMappingModal,
  FilterType,
} from "../role-mapping/AddRoleMappingModal";
import { Row, ServiceRole } from "../role-mapping/RoleMapping";
import type { ComponentProps } from "./components";


const Chip = ({ onClick, children, ...props }: any) => (
  <UIBadge variant="secondary" {...props}>
    {children}
    {onClick ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </UIBadge>
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
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);

const parseValue = (value: any) =>
  value?.includes(".") ? value.split(".") : ["", value || ""];

const parseRow = (value: Row) =>
  value.client?.clientId
    ? `${value.client.clientId}.${value.role.name}`
    : value.role.name;

export const RoleComponent = ({
  name,
  label,
  helpText,
  defaultValue,
  required,
  isDisabled = false,
  convertToName,
}: ComponentProps) => {
  const { t } = useTranslation();

  const [openModal, toggleModal] = useToggle();
  const [filterType, setFilterType] = useState<FilterType>("clients");

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldName = convertToName(name!);

  return (
    <FormGroup
      label={t(label!)}
      labelIcon={<HelpItem helpText={t(helpText!)} fieldLabelId={`${label}`} />}
      fieldId={name!}
      isRequired={required}
    >
      <Controller
        name={fieldName}
        defaultValue={defaultValue || ""}
        control={control}
        render={({ field }) => (
          <Split>
            {openModal && (
              <AddRoleMappingModal
                id="id"
                type="roles"
                filterType={filterType}
                name={name}
                onAssign={(rows) => field.onChange(parseRow(rows[0]))}
                onClose={toggleModal}
                isRadio
              />
            )}

            {field.value !== "" && (
              <SplitItem>
                <Chip textMaxWidth="500px" onClick={() => field.onChange("")}>
                  <ServiceRole
                    role={{ name: parseValue(field.value)[1] }}
                    client={{ clientId: parseValue(field.value)[0] }}
                  />
                </Chip>
              </SplitItem>
            )}
            <SplitItem>
              <AddRoleButton
                label="selectRole.label"
                onFilerTypeChange={(type) => {
                  setFilterType(type);
                  toggleModal();
                }}
                variant="secondary"
                data-testid="add-roles"
                isDisabled={isDisabled}
              />
            </SplitItem>
          </Split>
        )}
      />
      {errors[fieldName] && <FormErrorText message={t("required")} />}
    </FormGroup>
  );
};
