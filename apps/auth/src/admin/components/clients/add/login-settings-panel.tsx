/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/add/LoginSettingsPanel.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  SelectControl,
  TextAreaControl,
} from "../../../../shared/keycloak-ui-shared";
import { DefaultSwitchControl } from "../../switch-control";
import { FormAccess } from "../../form/form-access";
import { useServerInfo } from "../../../context/server-info/server-info-provider";
import { convertAttributeNameToForm } from "../../../util";
import { FormFields } from "../client-details";

export const LoginSettingsPanel = ({ access }: { access?: boolean }) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<FormFields>();

  const loginThemes = useServerInfo().themes!["login"];
  const consentRequired = watch("consentRequired");
  const displayOnConsentScreen: string = watch(
    convertAttributeNameToForm<FormFields>(
      "attributes.display.on.consent.screen",
    ),
  );

  return (
    <FormAccess isHorizontal fineGrainedAccess={access} role="manage-clients">
      <SelectControl
        name="attributes.login_theme"
        label={t("loginTheme")}
        labelIcon={t("loginThemeHelp")}
        controller={{
          defaultValue: "",
        }}
        options={[
          { key: "", value: t("choose") },
          ...loginThemes.map(({ name }) => ({ key: name, value: name })),
        ]}
      />
      <DefaultSwitchControl
        name="consentRequired"
        label={t("consentRequired")}
        labelIcon={t("consentRequiredHelp")}
      />
      <DefaultSwitchControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.display.on.consent.screen",
        )}
        label={t("displayOnClient")}
        labelIcon={t("displayOnClientHelp")}
        isDisabled={!consentRequired}
        stringify
      />
      <TextAreaControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.consent.screen.text",
        )}
        label={t("consentScreenText")}
        labelIcon={t("consentScreenTextHelp")}
        isDisabled={!(consentRequired && displayOnConsentScreen === "true")}
      />
    </FormAccess>
  );
};
