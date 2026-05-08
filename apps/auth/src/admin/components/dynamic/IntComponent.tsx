/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/IntComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { TextControl } from "../../../shared/keycloak-ui-shared";
import { useTranslation } from "react-i18next";
import { NumberComponentProps } from "./components";

export const IntComponent = ({
  name,
  label,
  helpText,
  convertToName,
  ...props
}: NumberComponentProps) => {
  const { t } = useTranslation();

  return (
    <TextControl
      name={convertToName(name!)}
      type="number"
      pattern="\d*"
      label={t(label!)}
      labelIcon={t(helpText!)}
      data-testid={name}
      rules={{
        required: {
          value: !!props.required,
          message: t("required"),
        },
      }}
      {...props}
    />
  );
};
