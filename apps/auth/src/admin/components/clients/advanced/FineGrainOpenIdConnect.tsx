/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/advanced/FineGrainOpenIdConnect.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { ProviderRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/serverInfoRepesentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";
import { HelpItem, SelectControl } from "../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../form/FormAccess";
import { MultiLineInput } from "../../multi-line-input/MultiLineInput";
import { useServerInfo } from "../../../context/server-info/ServerInfoProvider";
import { convertAttributeNameToForm, sortProviders } from "../../../util";
import { FormFields } from "../ClientDetails";
import { ApplicationUrls } from "./ApplicationUrls";
import { Controller, useFormContext } from "react-hook-form";


const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;
const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};
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
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);

type FineGrainOpenIdConnectProps = {
  save: () => void;
  reset: () => void;
  hasConfigureAccess?: boolean;
};

export const FineGrainOpenIdConnect = ({
  save,
  reset,
  hasConfigureAccess,
}: FineGrainOpenIdConnectProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const providers = useServerInfo().providers;
  const clientSignatureProviders = providers?.clientSignature.providers;
  const contentEncryptionProviders = providers?.contentencryption.providers;
  const cekManagementProviders = providers?.cekmanagement.providers;
  const signatureProviders = providers?.signature.providers;

  const convert = (list: { [index: string]: ProviderRepresentation }) =>
    sortProviders(list).map((i) => ({ key: i, value: i }));

  const prependEmpty = (list: { [index: string]: ProviderRepresentation }) => [
    { key: "", value: t("choose") },
    ...convert(list),
  ];

  const prependNone = (list: { [index: string]: ProviderRepresentation }) => [
    { key: "none", value: t("none") },
    ...convert(list),
  ];

  return (
    <FormAccess
      role="manage-clients"
      fineGrainedAccess={hasConfigureAccess}
      isHorizontal
    >
      <ApplicationUrls />
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.access.token.signed.response.alg",
        )}
        label={t("accessTokenSignatureAlgorithm")}
        labelIcon={t("accessTokenSignatureAlgorithmHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(clientSignatureProviders!)}
      />
      <FormGroup
        label={t("useRfc9068AccessTokenType")}
        fieldId="useRfc9068AccessTokenType"
        hasNoPaddingTop
        labelIcon={
          <HelpItem
            helpText={t("useRfc9068AccessTokenTypeHelp")}
            fieldLabelId="useRfc9068AccessTokenType"
          />
        }
      >
        <Controller
          name={convertAttributeNameToForm<FormFields>(
            "attributes.access.token.header.type.rfc9068",
          )}
          defaultValue="false"
          control={control}
          render={({ field }) => (
            <Switch
              id="useRfc9068AccessTokenType"
              label={t("on")}
              labelOff={t("off")}
              isChecked={field.value === "true"}
              onChange={(_event, value) => field.onChange(value.toString())}
              aria-label={t("useRfc9068AccessTokenType")}
            />
          )}
        />
      </FormGroup>
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.id.token.signed.response.alg",
        )}
        label={t("idTokenSignatureAlgorithm")}
        labelIcon={t("idTokenSignatureAlgorithmHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(clientSignatureProviders!)}
      />
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.id.token.encrypted.response.alg",
        )}
        label={t("idTokenEncryptionKeyManagementAlgorithm")}
        labelIcon={t("idTokenEncryptionKeyManagementAlgorithmHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(cekManagementProviders!)}
      />
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.id.token.encrypted.response.enc",
        )}
        label={t("idTokenEncryptionContentEncryptionAlgorithm")}
        labelIcon={t("idTokenEncryptionContentEncryptionAlgorithmHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(contentEncryptionProviders!)}
      />
      <FormGroup
        label={t("idTokenAsDetachedSignature")}
        fieldId="idTokenAsDetachedSignature"
        hasNoPaddingTop
        labelIcon={
          <HelpItem
            helpText={t("idTokenAsDetachedSignatureHelp")}
            fieldLabelId="idTokenAsDetachedSignature"
          />
        }
      >
        <Controller
          name={convertAttributeNameToForm<FormFields>(
            "attributes.id.token.as.detached.signature",
          )}
          defaultValue="false"
          control={control}
          render={({ field }) => (
            <Switch
              id="idTokenAsDetachedSignature"
              label={t("on")}
              labelOff={t("off")}
              isChecked={field.value === "true"}
              onChange={(_event, value) => field.onChange(value.toString())}
              aria-label={t("idTokenAsDetachedSignature")}
            />
          )}
        />
      </FormGroup>
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.user.info.response.signature.alg",
        )}
        label={t("userInfoSignedResponseAlgorithm")}
        labelIcon={t("userInfoSignedResponseAlgorithmHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(signatureProviders!)}
      />
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.user.info.encrypted.response.alg",
        )}
        label={t("userInfoResponseEncryptionKeyManagementAlgorithm")}
        labelIcon={t("userInfoResponseEncryptionKeyManagementAlgorithmHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(cekManagementProviders!)}
      />
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.user.info.encrypted.response.enc",
        )}
        label={t("userInfoResponseEncryptionContentEncryptionAlgorithm")}
        labelIcon={t(
          "userInfoResponseEncryptionContentEncryptionAlgorithmHelp",
        )}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(contentEncryptionProviders!)}
      />
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.request.object.signature.alg",
        )}
        label={t("requestObjectSignatureAlgorithm")}
        labelIcon={t("requestObjectSignatureAlgorithmHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependNone(clientSignatureProviders!)}
      />
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.request.object.encryption.alg",
        )}
        label={t("requestObjectEncryption")}
        labelIcon={t("requestObjectEncryptionHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(cekManagementProviders!)}
      />
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.request.object.encryption.enc",
        )}
        label={t("requestObjectEncoding")}
        labelIcon={t("requestObjectEncodingHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(contentEncryptionProviders!)}
      />
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.request.object.required",
        )}
        label={t("requestObjectRequired")}
        labelIcon={t("requestObjectRequiredHelp")}
        controller={{
          defaultValue: "not required",
        }}
        options={[
          "not required",
          "request or request_uri",
          "request only",
          "request_uri only",
        ].map((p) => ({
          key: p,
          value: t(`requestObject.${p}`),
        }))}
      />
      <FormGroup
        label={t("validRequestURIs")}
        fieldId="validRequestURIs"
        labelIcon={
          <HelpItem
            helpText={t("validRequestURIsHelp")}
            fieldLabelId="validRequestURIs"
          />
        }
      >
        <MultiLineInput
          name={convertAttributeNameToForm("attributes.request.uris")}
          aria-label={t("validRequestURIs")}
          addButtonLabel="addRequestUri"
          stringify
        />
      </FormGroup>
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.authorization.signed.response.alg",
        )}
        label={t("authorizationSignedResponseAlg")}
        labelIcon={t("authorizationSignedResponseAlgHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(signatureProviders!)}
      />
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.authorization.encrypted.response.alg",
        )}
        label={t("authorizationEncryptedResponseAlg")}
        labelIcon={t("authorizationEncryptedResponseAlgHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(cekManagementProviders!)}
      />
      <SelectControl
        name={convertAttributeNameToForm<FormFields>(
          "attributes.authorization.encrypted.response.enc",
        )}
        label={t("authorizationEncryptedResponseEnc")}
        labelIcon={t("authorizationEncryptedResponseEncHelp")}
        controller={{
          defaultValue: "",
        }}
        options={prependEmpty(contentEncryptionProviders!)}
      />
      <ActionGroup>
        <Button
          variant="secondary"
          id="fineGrainSave"
          data-testid="fineGrainSave"
          onClick={save}
        >
          {t("save")}
        </Button>
        <Button
          id="fineGrainRevert"
          data-testid="fineGrainRevert"
          variant="link"
          onClick={reset}
        >
          {t("revert")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
