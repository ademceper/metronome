/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/policy/ClientScope.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ClientScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientScopeRepresentation";
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
} from "@metronome/ui/components/table";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../../admin-client";
import useLocaleSort, { mapByKey } from "../../../../utils/useLocaleSort";
import { AddScopeDialog } from "../../scopes/AddScopeDialog";


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

export type RequiredIdValue = {
  id: string;
  required: boolean;
};

export const ClientScope = () => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { control, getValues, setValue } = useFormContext<{
    clientScopes: RequiredIdValue[];
  }>();

  const [open, setOpen] = useState(false);
  const [scopes, setScopes] = useState<ClientScopeRepresentation[]>([]);
  const [selectedScopes, setSelectedScopes] = useState<
    ClientScopeRepresentation[]
  >([]);

  const localeSort = useLocaleSort();

  useFetch(
    () => adminClient.clientScopes.find(),
    (scopes = []) => {
      const clientScopes = getValues("clientScopes") || [];
      setSelectedScopes(
        clientScopes.map((s) => scopes.find((c) => c.id === s.id)!),
      );
      setScopes(localeSort(scopes, mapByKey("name")));
    },
    [],
  );

  return (
    <FormGroup
      label={t("clientScopes")}
      labelIcon={
        <HelpItem
          helpText={t("clientsClientScopesHelp")}
          fieldLabelId="clientScopes"
        />
      }
      fieldId="clientScopes"
    >
      <Controller
        name="clientScopes"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <>
            {open && (
              <AddScopeDialog
                clientScopes={scopes.filter(
                  (scope) =>
                    !field.value
                      .map((c: RequiredIdValue) => c.id)
                      .includes(scope.id!),
                )}
                isClientScopesConditionType
                open={open}
                toggleDialog={() => setOpen(!open)}
                onAdd={(scopes) => {
                  setSelectedScopes([
                    ...selectedScopes,
                    ...scopes.map((s) => s.scope),
                  ]);
                  field.onChange([
                    ...field.value,
                    ...scopes
                      .map((scope) => scope.scope)
                      .map((item) => ({ id: item.id!, required: false })),
                  ]);
                }}
              />
            )}
            <Button
              data-testid="select-scope-button"
              variant="secondary"
              onClick={() => {
                setOpen(true);
              }}
            >
              {t("addClientScopes")}
            </Button>
          </>
        )}
      />
      {selectedScopes.length > 0 && (
        <Table variant="compact">
          <Thead>
            <Tr>
              <Th>{t("clientScopeTitle")}</Th>
              <Th>{t("required")}</Th>
              <Th aria-hidden="true" />
            </Tr>
          </Thead>
          <Tbody>
            {selectedScopes.map((scope, index) => (
              <Tr key={scope.id}>
                <Td>{scope.name}</Td>
                <Td>
                  <Controller
                    name={`clientScopes.${index}.required`}
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
                      setValue("clientScopes", [
                        ...getValues("clientScopes").filter(
                          (s) => s.id !== scope.id,
                        ),
                      ]);
                      setSelectedScopes([
                        ...selectedScopes.filter((s) => s.id !== scope.id),
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
  );
};
