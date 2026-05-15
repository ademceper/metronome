/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/OIDCGeneralSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { TextControl } from "../../../shared/keycloak-ui-shared";
import { DisplayOrder } from "../component/DisplayOrder";
import { RedirectUrl } from "../component/RedirectUrl";
import type { IdentityProviderParams } from "../../lib/identity-providers";

export const OIDCGeneralSettings = () => {
  const { t } = useTranslation();
  const { tab } = useParams<IdentityProviderParams>();

  const { control } = useFormContext();
  const alias = useWatch({ control, name: "alias" });

  return (
    <>
      <RedirectUrl id={alias} />

      <TextControl
        name="alias"
        label={t("alias")}
        labelIcon={t("aliasHelp")}
        readOnly={tab === "settings"}
        rules={{
          required: t("required"),
        }}
      />

      <TextControl name="displayName" label={t("displayName")} />
      <DisplayOrder />
    </>
  );
};
