/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/security-defences/Time.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { TimeSelectorControl } from "../../time-selector/TimeSelectorControl";

export const Time = ({
  name,
  style,
  min,
}: {
  name: string;
  style?: CSSProperties;
  min?: number;
}) => {
  const { t } = useTranslation();
  return (
    <TimeSelectorControl
      name={name}
      style={style}
      label={t(name)}
      labelIcon={t(`${name}Help`)}
      min={min}
      controller={{
        defaultValue: "",
        rules: { required: t("required"), min: min },
      }}
    />
  );
};
