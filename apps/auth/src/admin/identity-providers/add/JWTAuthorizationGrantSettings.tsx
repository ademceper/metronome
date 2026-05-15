/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/JWTAuthorizationGrantSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useTranslation } from "react-i18next";
import { TextControl, NumberControl } from "../../../shared/keycloak-ui-shared";
import { JWTAuthorizationGrantAssertionSettings } from "./JWTAuthorizationGrantAssertionSettings";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { JwksSettings } from "./JwksSettings";
import { useParams } from "react-router-dom";
import type { IdentityProviderParams } from "../../lib/identity-providers";


const Divider = (props: any) => <UISeparator {...props} />;

export default function JWTAuthorizationGrantSettings() {
  const { t } = useTranslation();
  const { tab } = useParams<IdentityProviderParams>();

  return (
    <>
      <TextControl
        name="alias"
        label={t("alias")}
        labelIcon={t("aliasHelp")}
        readOnly={tab === "settings"}
        rules={{
          required: t("required"),
        }}
      />
      <TextControl
        name="config.issuer"
        label={t("issuer")}
        rules={{
          required: t("required"),
        }}
      />
      <JwksSettings />
      <JWTAuthorizationGrantAssertionSettings />
      <NumberControl
        name="config.jwtAuthorizationGrantAllowedClockSkew"
        label={t("allowedClockSkew")}
        labelIcon={t("allowedClockSkewHelp")}
        controller={{ defaultValue: 0, rules: { min: 0, max: 2147483 } }}
      />
      <Divider />
    </>
  );
}
