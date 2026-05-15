/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/ScopePicker.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation";
import {
  FormErrorText,
  HelpItem,
  KeycloakSelect,
  SelectVariant,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { KeycloakSpinner } from "../../../../shared/keycloak-ui-shared";
import { useIsAdminPermissionsClient } from "../../../utils/useIsAdminPermissionsClient";
import { SelectOption } from "../../../../shared/pf-compat"


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

type Scope = {
  id: string;
  name: string;
};

type ScopePickerProps = {
  clientId: string;
  resourceTypeScopes?: string[];
};

export const ScopePicker = ({
  clientId,
  resourceTypeScopes,
}: ScopePickerProps) => {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const [scopes, setScopes] = useState<ScopeRepresentation[]>();
  const [search, setSearch] = useState("");
  const isAdminPermissionsClient = useIsAdminPermissionsClient(clientId);

  useFetch(
    () => {
      const params = {
        id: clientId,
        first: 0,
        max: 20,
        deep: false,
        name: search,
      };
      return adminClient.clients.listAllScopes(params);
    },
    setScopes,
    [search],
  );

  const renderScopes = (scopes: ScopeRepresentation[] | string[]) =>
    scopes.map((option, index) => (
      <SelectOption key={index} value={option}>
        {typeof option === "string" ? option : option.name}
      </SelectOption>
    ));

  if (!scopes && !resourceTypeScopes) return <KeycloakSpinner />;

  const allScopes =
    isAdminPermissionsClient && resourceTypeScopes
      ? resourceTypeScopes
      : scopes?.map((scope) => scope.name!);

  return (
    <FormGroup
      label={t("authorizationScopes")}
      labelIcon={
        <HelpItem helpText={t("clientScopesHelp")} fieldLabelId="scopes" />
      }
      fieldId="scopes"
      isRequired={isAdminPermissionsClient}
    >
      <Controller
        name="scopes"
        defaultValue={[]}
        control={control}
        rules={isAdminPermissionsClient ? { required: t("requiredField") } : {}}
        render={({ field }) => {
          const selectedValues = field.value.map((o: Scope) => o.name);
          return (
            <>
              <KeycloakSelect
                toggleId="scopes"
                variant={SelectVariant.typeaheadMulti}
                chipGroupProps={{
                  numChips: 3,
                  expandedText: t("hide"),
                  collapsedText: t("showRemaining"),
                }}
                onToggle={(val) => setOpen(val)}
                isOpen={open}
                selections={selectedValues}
                onFilter={(value) => {
                  setSearch(value);
                  return renderScopes(allScopes || []);
                }}
                onSelect={(selectedValue) => {
                  const option =
                    typeof selectedValue === "string"
                      ? selectedValue
                      : (selectedValue as Scope).name;
                  const changedValue = field.value.find(
                    (o: Scope) => o.name === option,
                  )
                    ? field.value.filter((item: Scope) => item.name !== option)
                    : [...field.value, { name: option }];
                  field.onChange(changedValue);
                }}
                onClear={() => {
                  setSearch("");
                  field.onChange([]);
                }}
                typeAheadAriaLabel={t("authorizationScopes")}
              >
                {renderScopes(allScopes || [])}
              </KeycloakSelect>
              {isAdminPermissionsClient && errors.scopes && (
                <FormErrorText message={t("required")} />
              )}
            </>
          );
        }}
      />
    </FormGroup>
  );
};
