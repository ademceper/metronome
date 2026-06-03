/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/user-credentials/LifespanField.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { TimeSelectorControl } from "../../time-selector/time-selector-control";

export const LifespanField = () => {
  const { t } = useTranslation();

  return (
    <TimeSelectorControl
      name="lifespan"
      label={t("lifespan")}
      labelIcon={t("lifespanHelp")}
      units={["minute", "hour", "day"]}
      menuAppendTo="parent"
      controller={{}}
    />
  );
};
