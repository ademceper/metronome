/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/UserProfileAttributeListComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { UserProfileConfig } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import {
  FormErrorText,
  HelpItem,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { KeySelect } from "../realm-settings/user-profile/attribute/key-select";
import type { ComponentProps } from "./components";


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

export const UserProfileAttributeListComponent = ({
  name,
  label,
  helpText,
  required = false,
  convertToName,
}: ComponentProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const {
    formState: { errors },
  } = useFormContext();

  const [config, setConfig] = useState<UserProfileConfig>();
  const convertedName = convertToName(name!);

  useFetch(
    () => adminClient.users.getProfile(),
    (cfg) => setConfig(cfg),
    [],
  );

  const convert = (config?: UserProfileConfig) => {
    if (!config?.attributes) return [];

    return config.attributes.map((option) => ({
      key: option.name!,
      value: option.name!,
    }));
  };

  if (!config) return null;

  const getError = () => {
    return convertedName
      .split(".")
      .reduce((record: any, key) => record?.[key], errors);
  };

  return (
    <FormGroup
      label={t(label!)}
      isRequired={required}
      labelIcon={<HelpItem helpText={t(helpText!)} fieldLabelId={label!} />}
      fieldId={convertedName!}
    >
      <KeySelect
        name={convertedName}
        rules={required ? { required: true } : {}}
        selectItems={convert(config)}
      />
      {getError() && <FormErrorText message={t("required")} />}
    </FormGroup>
  );
};
