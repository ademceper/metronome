/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/add/LoginSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { cn } from "@metronome/ui/lib/utils";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelpItem, TextControl } from "../../../../shared/keycloak-ui-shared";

import { MultiLineInput } from "../../multi-line-input/MultiLineInput";
import { convertAttributeNameToForm } from "../../../util";
import { FormFields } from "../ClientDetails";


const FormGroup = ({ label, fieldId, isRequired, labelIcon, helperText, helperTextInvalid, validated, children, ...props }: any) => (
  <div className={cn("space-y-1.5", (props as any).className)}>
    {label ? (
      <label htmlFor={fieldId} className="font-medium text-sm">
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
        {labelIcon}
      </label>
    ) : null}
    {children}
    {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
    {helperTextInvalid ? <p className="text-destructive text-xs">{helperTextInvalid}</p> : null}
  </div>
);

type LoginSettingsProps = {
  protocol?: string;
};

export const LoginSettings = ({
  protocol = "openid-connect",
}: LoginSettingsProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<FormFields>();

  const standardFlowEnabled = watch("standardFlowEnabled");
  const implicitFlowEnabled = watch("implicitFlowEnabled");

  return (
    <>
      <TextControl
        type="url"
        name="rootUrl"
        label={t("rootUrl")}
        labelIcon={t("rootURLHelp")}
      />
      <TextControl
        type="url"
        name="baseUrl"
        label={t("homeURL")}
        labelIcon={t("homeURLHelp")}
      />
      {(standardFlowEnabled || implicitFlowEnabled) && (
        <>
          <FormGroup
            label={t("validRedirectUri")}
            fieldId="kc-redirect"
            labelIcon={
              <HelpItem
                helpText={t("validRedirectURIsHelp")}
                fieldLabelId="validRedirectUri"
              />
            }
          >
            <MultiLineInput
              id="kc-redirect"
              name="redirectUris"
              aria-label={t("validRedirectUri")}
              addButtonLabel="addRedirectUri"
            />
          </FormGroup>
          <FormGroup
            label={t("validPostLogoutRedirectUri")}
            fieldId="kc-postLogoutRedirect"
            labelIcon={
              <HelpItem
                helpText={t("validPostLogoutRedirectURIsHelp")}
                fieldLabelId="validPostLogoutRedirectUri"
              />
            }
          >
            <MultiLineInput
              id="kc-postLogoutRedirect"
              name={convertAttributeNameToForm(
                "attributes.post.logout.redirect.uris",
              )}
              aria-label={t("validPostLogoutRedirectUri")}
              addButtonLabel="addPostLogoutRedirectUri"
              stringify
            />
          </FormGroup>
        </>
      )}
      {protocol === "saml" && (
        <>
          <TextControl
            name="attributes.saml_idp_initiated_sso_url_name"
            label={t("idpInitiatedSsoUrlName")}
            labelIcon={t("idpInitiatedSsoUrlNameHelp")}
          />
          <TextControl
            name="attributes.saml_idp_initiated_sso_relay_state"
            label={t("idpInitiatedSsoRelayState")}
            labelIcon={t("idpInitiatedSsoRelayStateHelp")}
          />
          <TextControl
            type="url"
            name="adminUrl"
            label={t("masterSamlProcessingUrl")}
            labelIcon={t("masterSamlProcessingUrlHelp")}
          />
        </>
      )}
      {protocol !== "saml" && standardFlowEnabled && (
        <FormGroup
          label={t("webOrigins")}
          fieldId="kc-web-origins"
          labelIcon={
            <HelpItem
              helpText={t("webOriginsHelp")}
              fieldLabelId="webOrigins"
            />
          }
        >
          <MultiLineInput
            id="kc-web-origins"
            name="webOrigins"
            aria-label={t("webOrigins")}
            addButtonLabel="addWebOrigins"
          />
        </FormGroup>
      )}
    </>
  );
};
