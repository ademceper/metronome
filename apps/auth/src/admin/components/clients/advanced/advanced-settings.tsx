/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/advanced/AdvancedSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
  HelpItem,
  TextControl,
  SelectControl,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DefaultSwitchControl } from "../../switch-control";
import { FormAccess } from "../../form/form-access";
import { KeyValueInput } from "../../key-value-form/key-value-input";
import { MultiLineInput } from "../../multi-line-input/multi-line-input";
import { TimeSelector } from "../../time-selector/time-selector";
import { useRealm } from "../../../context/realm-context/realm-context";
import { convertAttributeNameToForm } from "../../../util";
import { FormFields } from "../client-details";
import { TokenLifespan } from "./token-lifespan";
import useIsFeatureEnabled, { Feature } from "../../../utils/use-is-feature-enabled";


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
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

type AdvancedSettingsProps = {
  save: () => void;
  reset: () => void;
  protocol?: string;
  hasConfigureAccess?: boolean;
};

export const AdvancedSettings = ({
  save,
  reset,
  protocol,
  hasConfigureAccess,
}: AdvancedSettingsProps) => {
  const { t } = useTranslation();

  const { realmRepresentation: realm } = useRealm();

  const { control, watch, register } = useFormContext();

  const acrUriMapRealm = realm?.attributes?.["acr.uri.map"]
    ? Object.values(JSON.parse(realm.attributes["acr.uri.map"]))
    : [];

  const acrLoAMapClient = watch(
    convertAttributeNameToForm<FormFields>("attributes.acr.loa.map"),
    [],
  );

  const validAcrLoAOptions = () =>
    acrLoAMapClient.length > 0
      ? acrLoAMapClient.map((i: any) => i?.key).filter((i: any) => i !== "")
      : acrUriMapRealm;

  const acrLoAMapNamesOptions = () => [
    { key: "", value: t("choose") },
    ...validAcrLoAOptions().map((i: any) => ({ key: i, value: i })),
  ];

  const isFeatureEnabled = useIsFeatureEnabled();

  return (
    <FormAccess
      role="manage-realm"
      fineGrainedAccess={hasConfigureAccess}
      isHorizontal
    >
      {protocol === "saml" && (
        <>
          <FormGroup
            label={t("assertionLifespan")}
            fieldId="assertionLifespan"
            labelIcon={
              <HelpItem
                helpText={t("assertionLifespanHelp")}
                fieldLabelId="assertionLifespan"
              />
            }
          >
            <Controller
              name={convertAttributeNameToForm<FormFields>(
                "attributes.saml.assertion.lifespan",
              )}
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TimeSelector
                  units={["minute", "day", "hour"]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormGroup>
          {isFeatureEnabled(Feature.StepUpAuthenticationSaml) && (
            <>
              <FormGroup
                label={t("acrToLoAMapping")}
                fieldId="acrToLoAMapping"
                labelIcon={
                  <HelpItem
                    helpText={t("acrToLoAMappingSamlHelp")}
                    fieldLabelId="acrToLoAMapping"
                  />
                }
              >
                <KeyValueInput
                  label={t("acrToLoAMapping")}
                  name={convertAttributeNameToForm("attributes.acr.loa.map")}
                  keyLabel="uri"
                  valueLabel="loa"
                  ValueComponent={(props) => (
                    <TextInput
                      placeholder={t("loaPlaceholder")}
                      aria-label={t("loa")}
                      validated={props.error ? "error" : "default"}
                      {...register(props.name, {
                        required: true,
                        validate: (v: string) => Number.isInteger(parseInt(v)),
                      })}
                    />
                  )}
                />
              </FormGroup>
              <SelectControl
                name={convertAttributeNameToForm(
                  "attributes.minimum.acr.value",
                )}
                label={t("minimumACRValue")}
                labelIcon={t("minimumACRValueSamlHelp")}
                controller={{
                  defaultValue: "",
                  rules: {
                    validate: (v: string) =>
                      v === "" || validAcrLoAOptions().includes(v),
                  },
                }}
                options={acrLoAMapNamesOptions()}
              />
            </>
          )}
        </>
      )}
      {protocol === "openid-connect" && (
        <>
          <TokenLifespan
            id="accessTokenLifespan"
            name={convertAttributeNameToForm(
              "attributes.access.token.lifespan",
            )}
            defaultValue={realm?.accessTokenLifespan}
            units={["minute", "day", "hour"]}
          />
          <TokenLifespan
            id="clientSessionIdle"
            name={convertAttributeNameToForm(
              "attributes.client.session.idle.timeout",
            )}
            defaultValue={realm?.clientSessionIdleTimeout}
            units={["minute", "day", "hour"]}
          />
          <TokenLifespan
            id="clientSessionMax"
            name={convertAttributeNameToForm(
              "attributes.client.session.max.lifespan",
            )}
            defaultValue={realm?.clientSessionMaxLifespan}
            units={["minute", "day", "hour"]}
          />
          <TokenLifespan
            id="clientOfflineSessionIdle"
            name={convertAttributeNameToForm(
              "attributes.client.offline.session.idle.timeout",
            )}
            defaultValue={realm?.offlineSessionIdleTimeout}
            units={["minute", "day", "hour"]}
          />

          {realm?.offlineSessionMaxLifespanEnabled && (
            <TokenLifespan
              id="clientOfflineSessionMax"
              name={convertAttributeNameToForm(
                "attributes.client.offline.session.max.lifespan",
              )}
              defaultValue={
                realm?.offlineSessionMaxLifespanEnabled
                  ? realm.offlineSessionMaxLifespan
                  : undefined
              }
              units={["minute", "day", "hour"]}
            />
          )}
          <DefaultSwitchControl
            name={convertAttributeNameToForm<FormFields>(
              "attributes.tls.client.certificate.bound.access.tokens",
            )}
            label={t("oAuthMutual")}
            labelIcon={t("oAuthMutualHelp")}
            stringify
          />
          <DefaultSwitchControl
            name={convertAttributeNameToForm<FormFields>(
              "attributes.require.pushed.authorization.requests",
            )}
            label={t("pushedAuthorizationRequestRequired")}
            labelIcon={t("pushedAuthorizationRequestRequiredHelp")}
            stringify
          />
          <DefaultSwitchControl
            name={convertAttributeNameToForm<FormFields>(
              "attributes.client.use.lightweight.access.token.enabled",
            )}
            label={t("lightweightAccessToken")}
            labelIcon={t("lightweightAccessTokenHelp")}
            stringify
          />

          <DefaultSwitchControl
            name={convertAttributeNameToForm<FormFields>(
              "attributes.client.introspection.response.allow.jwt.claim.enabled",
            )}
            label={t("supportJwtClaimInIntrospectionResponse")}
            labelIcon={t("supportJwtClaimInIntrospectionResponseHelp")}
            stringify
          />
          <FormGroup
            label={t("acrToLoAMapping")}
            fieldId="acrToLoAMapping"
            labelIcon={
              <HelpItem
                helpText={t("acrToLoAMappingHelp")}
                fieldLabelId="acrToLoAMapping"
              />
            }
          >
            <KeyValueInput
              label={t("acrToLoAMapping")}
              name={convertAttributeNameToForm("attributes.acr.loa.map")}
              keyLabel="acr"
              valueLabel="loa"
              ValueComponent={(props) => (
                <TextInput
                  placeholder={t("loaPlaceholder")}
                  aria-label={t("loa")}
                  validated={props.error ? "error" : "default"}
                  {...register(props.name, {
                    required: true,
                    validate: (v: string) => Number.isInteger(parseInt(v)),
                  })}
                />
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("defaultACRValues")}
            fieldId="defaultACRValues"
            labelIcon={
              <HelpItem
                helpText={t("defaultACRValuesHelp")}
                fieldLabelId="defaultACRValues"
              />
            }
          >
            <MultiLineInput
              id="defaultACRValues"
              aria-label="defaultACRValues"
              name={convertAttributeNameToForm("attributes.default.acr.values")}
              stringify
            />
          </FormGroup>
          <TextControl
            type="text"
            name={convertAttributeNameToForm("attributes.minimum.acr.value")}
            label={t("minimumACRValue")}
            labelIcon={t("minimumACRValueHelp")}
          />
        </>
      )}
      <ActionGroup>
        <Button
          variant="secondary"
          onClick={save}
          data-testid="OIDCAdvancedSave"
        >
          {t("save")}
        </Button>
        <Button variant="link" onClick={reset} data-testid="OIDCAdvancedRevert">
          {t("revert")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
