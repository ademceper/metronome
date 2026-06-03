/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/advanced/OpenIdConnectCompatibilityModes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormAccess } from "../../form/form-access";
import { HelpItem, SelectControl } from "../../../../shared/keycloak-ui-shared";
import { convertAttributeNameToForm } from "../../../util";
import { FormFields } from "../client-details";
import useIsFeatureEnabled, { Feature } from "../../../utils/use-is-feature-enabled";
import { MapComponent } from "../../dynamic/map-component";


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

type OpenIdConnectCompatibilityModesProps = {
  save: () => void;
  reset: () => void;
  hasConfigureAccess?: boolean;
};

export const OpenIdConnectCompatibilityModes = ({
  save,
  reset,
  hasConfigureAccess,
}: OpenIdConnectCompatibilityModesProps) => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();
  const isFeatureEnabled = useIsFeatureEnabled();
  const tokenExchangeEnabled = watch(
    convertAttributeNameToForm<FormFields>(
      "attributes.standard.token.exchange.enabled",
    ),
  );
  const useRefreshTokens = watch(
    convertAttributeNameToForm<FormFields>("attributes.use.refresh.tokens"),
    "true",
  );
  const jwtAuthorizationGrantEnabled = watch(
    convertAttributeNameToForm<FormFields>(
      "attributes.oauth2.jwt.authorization.grant.enabled",
    ),
    false,
  );
  const jwtAuthorizationGrantIdP = watch(
    convertAttributeNameToForm<FormFields>(
      "attributes.oauth2.jwt.authorization.grant.idp",
    ),
  );
  return (
    <FormAccess
      role="manage-clients"
      fineGrainedAccess={hasConfigureAccess}
      isHorizontal
    >
      <FormGroup
        label={t("excludeSessionStateFromAuthenticationResponse")}
        fieldId="excludeSessionStateFromAuthenticationResponse"
        hasNoPaddingTop
        labelIcon={
          <HelpItem
            helpText={t("excludeSessionStateFromAuthenticationResponseHelp")}
            fieldLabelId="excludeSessionStateFromAuthenticationResponse"
          />
        }
      >
        <Controller
          name={convertAttributeNameToForm<FormFields>(
            "attributes.exclude.session.state.from.auth.response",
          )}
          defaultValue=""
          control={control}
          render={({ field }) => (
            <Switch
              id="excludeSessionStateFromAuthenticationResponse-switch"
              label={t("on")}
              labelOff={t("off")}
              isChecked={field.value === "true"}
              onChange={(_event, value) => field.onChange(value.toString())}
              aria-label={t("excludeSessionStateFromAuthenticationResponse")}
            />
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("excludeIssuerFromAuthenticationResponse")}
        fieldId="excludeIssuerFromAuthenticationResponse"
        hasNoPaddingTop
        labelIcon={
          <HelpItem
            helpText={t("excludeIssuerFromAuthenticationResponseHelp")}
            fieldLabelId="excludeIssuerFromAuthenticationResponse"
          />
        }
      >
        <Controller
          name={convertAttributeNameToForm<FormFields>(
            "attributes.exclude.issuer.from.auth.response",
          )}
          defaultValue=""
          control={control}
          render={({ field }) => (
            <Switch
              id="excludeIssuerFromAuthenticationResponse-switch"
              label={t("on")}
              labelOff={t("off")}
              isChecked={field.value === "true"}
              onChange={(_event, value) => field.onChange(value.toString())}
              aria-label={t("excludeIssuerFromAuthenticationResponse")}
            />
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("useRefreshTokens")}
        fieldId="useRefreshTokens"
        hasNoPaddingTop
        labelIcon={
          <HelpItem
            helpText={t("useRefreshTokensHelp")}
            fieldLabelId="useRefreshTokens"
          />
        }
      >
        <Controller
          name={convertAttributeNameToForm<FormFields>(
            "attributes.use.refresh.tokens",
          )}
          defaultValue="true"
          control={control}
          render={({ field }) => (
            <Switch
              id="useRefreshTokens"
              label={t("on")}
              labelOff={t("off")}
              isChecked={field.value === "true"}
              onChange={(_event, value) => field.onChange(value.toString())}
              aria-label={t("useRefreshTokens")}
            />
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("useRefreshTokenForClientCredentialsGrant")}
        fieldId="useRefreshTokenForClientCredentialsGrant"
        hasNoPaddingTop
        labelIcon={
          <HelpItem
            helpText={t("useRefreshTokenForClientCredentialsGrantHelp")}
            fieldLabelId="useRefreshTokenForClientCredentialsGrant"
          />
        }
      >
        <Controller
          name={convertAttributeNameToForm<FormFields>(
            "attributes.client_credentials.use_refresh_token",
          )}
          defaultValue="false"
          control={control}
          render={({ field }) => (
            <Switch
              id="useRefreshTokenForClientCredentialsGrant"
              label={t("on")}
              labelOff={t("off")}
              isChecked={field.value === "true"}
              onChange={(_event, value) => field.onChange(value.toString())}
              aria-label={t("useRefreshTokenForClientCredentialsGrant")}
            />
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("useLowerCaseBearerType")}
        fieldId="useLowerCaseBearerType"
        hasNoPaddingTop
        labelIcon={
          <HelpItem
            helpText={t("useLowerCaseBearerTypeHelp")}
            fieldLabelId="useLowerCaseBearerType"
          />
        }
      >
        <Controller
          name={convertAttributeNameToForm<FormFields>(
            "attributes.token.response.type.bearer.lower-case",
          )}
          defaultValue="false"
          control={control}
          render={({ field }) => (
            <Switch
              id="useLowerCaseBearerType"
              label={t("on")}
              labelOff={t("off")}
              isChecked={field.value === "true"}
              onChange={(_event, value) => field.onChange(value.toString())}
              aria-label={t("useLowerCaseBearerType")}
            />
          )}
        />
      </FormGroup>

      {isFeatureEnabled(Feature.StandardTokenExchangeV2) && (
        <SelectControl
          name={convertAttributeNameToForm<FormFields>(
            "attributes.standard.token.exchange.enableRefreshRequestedTokenType",
          )}
          label={t("enableRefreshRequestedTokenType")}
          labelIcon={t("enableRefreshRequestedTokenTypeHelp")}
          controller={{
            defaultValue: "",
          }}
          isDisabled={
            tokenExchangeEnabled?.toString() !== "true" ||
            useRefreshTokens?.toString() !== "true"
          }
          options={[
            { key: "", value: t("choose") },
            { key: "NO", value: t("no") },
            { key: "SAME_SESSION", value: t("sameSession") },
          ]}
        />
      )}
      {isFeatureEnabled(Feature.JWTAuthorizationGrant) &&
        jwtAuthorizationGrantEnabled.toString() === "true" &&
        jwtAuthorizationGrantIdP && (
          <MapComponent
            name="attributes.oauth2.jwt.authorization.grant.audience"
            label="jwtAuthorizationGrantAudience"
            helpText="jwtAuthorizationGrantAudienceHelp"
            convertToName={convertAttributeNameToForm}
            options={jwtAuthorizationGrantIdP.split("##")}
          />
        )}
      <ActionGroup>
        <Button
          variant="secondary"
          onClick={save}
          data-testid="OIDCCompatabilitySave"
        >
          {t("save")}
        </Button>
        <Button
          variant="link"
          onClick={reset}
          data-testid="OIDCCompatabilityRevert"
        >
          {t("revert")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
