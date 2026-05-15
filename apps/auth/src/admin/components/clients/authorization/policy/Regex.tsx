/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/policy/Regex.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import {
  SwitchControl,
  TextControl,
} from "../../../../../shared/keycloak-ui-shared";

export const Regex = () => {
  const { t } = useTranslation();

  return (
    <>
      <TextControl
        name="targetClaim"
        label={t("targetClaim")}
        labelIcon={t("targetClaimHelp")}
        rules={{ required: t("required") }}
      />
      <TextControl
        name="pattern"
        label={t("regexPattern")}
        labelIcon={t("regexPatternHelp")}
        rules={{ required: t("required") }}
      />
      <SwitchControl
        name="targetContextAttributes"
        label={t("targetContextAttributes")}
        labelIcon={t("targetContextAttributesHelp")}
        labelOn={t("yes")}
        labelOff={t("no")}
      />
    </>
  );
};
