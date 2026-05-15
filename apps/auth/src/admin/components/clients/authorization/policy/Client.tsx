/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/policy/Client.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { ClientSelect } from "../../../client/ClientSelect";

export const Client = () => {
  const { t } = useTranslation();

  return (
    <ClientSelect
      name="clients"
      label={t("clients")}
      helpText={t("policyClientHelp")}
      required
      defaultValue={[]}
      variant="typeaheadMulti"
      clientKey="id"
    />
  );
};
