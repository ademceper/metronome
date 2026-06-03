/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/OpenIdConnectSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { cn } from "@metronome/ui/lib/utils";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormErrorText, HelpItem } from "../../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../../admin-client";
import { JsonFileUpload } from "../../json-file-upload/json-file-upload";
import { DiscoveryEndpointField } from "../component/discovery-endpoint-field";
import { DiscoverySettings } from "./discovery-settings";


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
const TitleSizes = {
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;
const Title = ({ headingLevel = "h1", size, children, className, ...props }: any) =>
  React.createElement(headingLevel, {
    className: cn("font-heading font-medium", (TitleSizes as any)[size as string] ?? "text-base", className),
    ...props,
  }, children);

type OpenIdConnectSettingsProps = {
  isOIDC: boolean;
};

export const OpenIdConnectSettings = ({
  isOIDC,
}: OpenIdConnectSettingsProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const id = "oidc";

  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const setupForm = (result: any) => {
    Object.keys(result).map((k) => setValue(`config.${k}`, result[k]));
  };

  const fileUpload = async (obj?: object) => {
    clearErrors("discoveryError");
    if (!obj) {
      return;
    }

    const formData = new FormData();
    formData.append("providerId", id);
    formData.append("file", new Blob([JSON.stringify(obj)]));

    try {
      const result =
        await adminClient.identityProviders.importFromUrl(formData);
      setupForm(result);
    } catch (error) {
      setError("discoveryError", {
        type: "manual",
        message: (error as Error).message,
      });
    }
  };

  return (
    <>
      <Title headingLevel="h2" size="xl" className="kc-form-panel__title">
        {isOIDC ? t("oidcSettings") : t("oAuthSettings")}
      </Title>

      <DiscoveryEndpointField
        id="oidc"
        fileUpload={
          <FormGroup
            label={t("importConfig")}
            fieldId="kc-import-config"
            labelIcon={
              <HelpItem
                helpText={t("importConfigHelp")}
                fieldLabelId="importConfig"
              />
            }
          >
            <JsonFileUpload
              id="kc-import-config"
              helpText={t("identity=providers-help:jsonFileUpload")}
              hideDefaultPreview
              unWrap
              validated={errors.discoveryError ? "error" : "default"}
              onChange={(value) => fileUpload(value)}
            />
            {errors.discoveryError && (
              <FormErrorText
                message={errors.discoveryError.message as string}
              />
            )}
          </FormGroup>
        }
      >
        {(readonly) => (
          <DiscoverySettings readOnly={readonly} isOIDC={isOIDC} />
        )}
      </DiscoveryEndpointField>
    </>
  );
};
