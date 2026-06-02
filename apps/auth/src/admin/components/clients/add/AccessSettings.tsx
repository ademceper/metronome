/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/add/AccessSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextControl } from "../../../../shared/keycloak-ui-shared";

import { FixedButtonsGroup } from "../../form/FixedButtonGroup";
import { FormAccess } from "../../form/FormAccess";
import { useAccess } from "../../../context/access/access";
import { FormFields } from "../ClientDetails";
import type { ClientSettingsProps } from "../ClientSettings";
import { LoginSettings } from "./LoginSettings";

export const AccessSettings = ({
  client,
  save,
  reset,
}: ClientSettingsProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<FormFields>();

  const { hasAccess } = useAccess();
  const isManager = hasAccess("manage-clients") || client.access?.configure;

  const protocol = watch("protocol");

  return (
    <FormAccess
      isHorizontal
      fineGrainedAccess={client.access?.configure}
      role="manage-clients"
    >
      {!client.bearerOnly && <LoginSettings protocol={protocol} />}
      {protocol !== "saml" && (
        <TextControl
          type="url"
          name="adminUrl"
          label={t("adminURL")}
          labelIcon={t("adminURLHelp")}
        />
      )}
      {client.bearerOnly && (
        <FixedButtonsGroup
          name="settings"
          save={save}
          reset={reset}
          isDisabled={isManager}
        />
      )}
    </FormAccess>
  );
};
