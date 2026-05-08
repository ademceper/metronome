/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/PasswordComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { PasswordControl } from "../../../shared/keycloak-ui-shared";
import type { ComponentProps } from "./components";

export const PasswordComponent = ({
  name,
  label,
  helpText,
  defaultValue,
  required,
  isDisabled = false,
  convertToName,
}: ComponentProps) => {
  const { t } = useTranslation();

  return (
    <PasswordControl
      name={convertToName(name!)}
      label={t(label!)}
      labelIcon={t(helpText!)}
      isDisabled={isDisabled}
      defaultValue={defaultValue?.toString()}
      rules={{
        required: { value: !!required, message: t("required") },
      }}
    />
  );
};
