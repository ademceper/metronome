/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/policy/User.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { UserSelect } from "../../../users/user-select";

export const User = () => {
  const { t } = useTranslation();
  return (
    <UserSelect
      name="users"
      label="users"
      helpText={t("policyUsers")}
      defaultValue={[]}
      variant="typeaheadMulti"
    />
  );
};
