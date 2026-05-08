/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/BuildInLabel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Label } from "../../shared/@patternfly/react-core";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react"
import { useTranslation } from "react-i18next";
export const BuildInLabel = () => {
  const { t } = useTranslation();

  return (
    <Label icon={<CheckCircleIcon className={""} />}>
      {t("buildIn")}
    </Label>
  );
};
