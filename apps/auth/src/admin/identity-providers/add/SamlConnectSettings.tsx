/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/SamlConnectSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { fetchWithError } from "@keycloak/keycloak-admin-client";
import type IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import {
  FormErrorText,
  HelpItem,
  TextControl,
  useEnvironment,
} from "../../../shared/keycloak-ui-shared";
import { cn } from "@metronome/ui/lib/utils";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAdminClient } from "../../admin-client";
import { FileUploadForm } from "../../components/json-file-upload/FileUploadForm";
import { useRealm } from "../../context/realm-context/RealmContext";
import type { Environment } from "../../environment";
import { addTrailingSlash } from "../../util";
import { getAuthorizationHeaders } from "../../utils/getAuthorizationHeaders";
import { DiscoveryEndpointField } from "../component/DiscoveryEndpointField";
import { DescriptorSettings } from "./DescriptorSettings";


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

type FormFields = IdentityProviderRepresentation & {
  discoveryError: string;
};

export const SamlConnectSettings = () => {
  const { adminClient } = useAdminClient();
  const { environment } = useEnvironment<Environment>();

  const { t } = useTranslation();
  const id = "saml";

  const { realm } = useRealm();
  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<FormFields>();

  const setupForm = (result: IdentityProviderRepresentation) => {
    Object.entries(result).map(([key, value]) =>
      setValue(`config.${key}`, value),
    );
  };

  const fileUpload = async (xml: string) => {
    clearErrors("discoveryError");
    if (!xml) {
      return;
    }
    const formData = new FormData();
    formData.append("providerId", id);
    formData.append("file", new Blob([xml]));

    try {
      const response = await fetchWithError(
        `${addTrailingSlash(
          adminClient.baseUrl,
        )}admin/realms/${realm}/identity-provider/import-config`,
        {
          method: "POST",
          body: formData,
          headers: getAuthorizationHeaders(await adminClient.getAccessToken()),
        },
      );
      if (response.ok) {
        const result = await response.json();
        setupForm(result);
      } else {
        setError("discoveryError", {
          type: "manual",
          message: response.statusText,
        });
      }
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
        {t("samlSettings")}
      </Title>

      <TextControl
        name="config.entityId"
        label={t("serviceProviderEntityId")}
        labelIcon={t("serviceProviderEntityIdHelp")}
        defaultValue={`${environment.serverBaseUrl}/realms/${realm}`}
        rules={{
          required: t("required"),
        }}
      />

      <DiscoveryEndpointField
        id="saml"
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
            <FileUploadForm
              id="kc-import-config"
              extension=".xml"
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
        {(readonly) => <DescriptorSettings readOnly={readonly} />}
      </DiscoveryEndpointField>
    </>
  );
};
