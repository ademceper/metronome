/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/add/AdvancedSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type AuthenticationFlowRepresentation from "@keycloak/keycloak-admin-client/lib/defs/authenticationFlowRepresentation";
import type IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";
import {
  FormErrorText,
  HelpItem,
  KeycloakSelect,
  SelectControl,
  SelectVariant,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Input as UIInput } from "@metronome/ui/components/input";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import useIsFeatureEnabled, { Feature } from "../../../utils/use-is-feature-enabled";
import type { FieldProps } from "../component/form-group-field";
import { FormGroupField } from "../component/form-group-field";
import { SwitchField } from "../component/switch-field";
import { TextField } from "../component/text-field";
import { TimeSelector } from "../../time-selector/time-selector";
import { SelectOption } from "../../../../shared/pf-compat"


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
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);
const ValidatedOptions = {
  default: "default",
  success: "success",
  warning: "warning",
  error: "error",
} as const;

const LoginFlow = ({
  field,
  label,
  defaultValue,
  labelForEmpty = "none",
}: FieldProps & { defaultValue: string; labelForEmpty?: string }) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { control } = useFormContext();

  const [flows, setFlows] = useState<AuthenticationFlowRepresentation[]>();
  const [open, setOpen] = useState(false);

  useFetch(
    () => adminClient.authenticationManagement.getFlows(),
    (flows) =>
      setFlows(flows.filter((flow) => flow.providerId === "basic-flow")),
    [],
  );

  return (
    <FormGroup
      label={t(label)}
      labelIcon={<HelpItem helpText={t(`${label}Help`)} fieldLabelId={label} />}
      fieldId={label}
    >
      <Controller
        name={field}
        defaultValue={defaultValue}
        control={control}
        render={({ field }) => (
          <KeycloakSelect
            toggleId={label}
            onToggle={() => setOpen(!open)}
            onSelect={(value) => {
              field.onChange(value as string);
              setOpen(false);
            }}
            selections={field.value || t(labelForEmpty)}
            variant={SelectVariant.single}
            aria-label={t(label)}
            isOpen={open}
          >
            {[
              ...(defaultValue === ""
                ? [
                    <SelectOption key="empty" value="">
                      {t(labelForEmpty)}
                    </SelectOption>,
                  ]
                : []),
              ...(flows?.map((option) => (
                <SelectOption
                  selected={option.alias === field.value}
                  key={option.id}
                  value={option.alias}
                >
                  {option.alias}
                </SelectOption>
              )) || []),
            ]}
          </KeycloakSelect>
        )}
      />
    </FormGroup>
  );
};

const SYNC_MODES = ["IMPORT", "LEGACY", "FORCE"];
const SHOW_IN_ACCOUNT_CONSOLE_VALUES = ["ALWAYS", "WHEN_LINKED", "NEVER"];
type AdvancedSettingsProps = {
  isOIDC: boolean;
  isSAML: boolean;
  isOAuth2: boolean;
};

export const AdvancedSettings = ({
  isOIDC,
  isSAML,
  isOAuth2,
}: AdvancedSettingsProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<IdentityProviderRepresentation>();
  const filteredByClaim = useWatch({
    control,
    name: "config.filteredByClaim",
    defaultValue: "false",
  });
  const claimFilterRequired = filteredByClaim === "true";
  const isFeatureEnabled = useIsFeatureEnabled();
  const isTransientUsersEnabled = isFeatureEnabled(Feature.TransientUsers);
  const isClientAuthFederatedEnabled = isFeatureEnabled(
    Feature.ClientAuthFederated,
  );
  const jwtAuthorizationGrant = isFeatureEnabled(Feature.JWTAuthorizationGrant);
  const transientUsers = useWatch({
    control,
    name: "config.doNotStoreUsers",
    defaultValue: "false",
  });
  const syncModeAvailable = transientUsers === "false";
  const jwtAuthorizationGrantEnabled = useWatch({
    control,
    name: "config.jwtAuthorizationGrantEnabled",
  });
  const supportsClientAssertions = useWatch({
    control,
    name: "config.supportsClientAssertions",
  });
  return (
    <>
      {!isOIDC && !isSAML && !isOAuth2 && (
        <TextField field="config.defaultScope" label="scopes" />
      )}
      {isFeatureEnabled(Feature.IdentityBrokeringAPIV2) && (
        <SwitchField
          field="config.storeTokenInSession"
          label="storeTokenInSession"
          fieldType="boolean"
          defaultValue={!isSAML}
        />
      )}
      <SwitchField field="storeToken" label="storeTokens" fieldType="boolean" />
      {(isSAML || isOIDC || isOAuth2) && (
        <SwitchField
          field="addReadTokenRoleOnCreate"
          label="storedTokensReadable"
          fieldType="boolean"
        />
      )}
      {!isOIDC && !isSAML && !isOAuth2 && (
        <>
          <SwitchField
            field="config.acceptsPromptNoneForwardFromClient"
            label="acceptsPromptNone"
          />
          <SwitchField field="config.disableUserInfo" label="disableUserInfo" />
        </>
      )}
      {isOIDC && (
        <SwitchField field="config.isAccessTokenJWT" label="isAccessTokenJWT" />
      )}
      <SwitchField field="trustEmail" label="trustEmail" fieldType="boolean" />
      <SwitchField
        field="linkOnly"
        label="accountLinkingOnly"
        fieldType="boolean"
      />
      <SwitchField
        field="hideOnLogin"
        label="hideOnLoginPage"
        fieldType="boolean"
      />
      <SelectControl
        name="config.showInAccountConsole"
        label={t("showInAccountConsole")}
        labelIcon={t("showInAccountConsoleHelp")}
        options={SHOW_IN_ACCOUNT_CONSOLE_VALUES.map((showInAccountConsole) => ({
          key: showInAccountConsole,
          value: t(
            `showInAccountConsole.${showInAccountConsole.toLocaleLowerCase()}`,
          ),
        }))}
        controller={{
          defaultValue: SHOW_IN_ACCOUNT_CONSOLE_VALUES[0],
          rules: { required: t("required") },
        }}
      />

      {((!isSAML && !isOAuth2) || isOIDC) && (
        <FormGroupField label="filteredByClaim">
          <Controller
            name="config.filteredByClaim"
            defaultValue="false"
            control={control}
            render={({ field }) => (
              <Switch
                id="filteredByClaim"
                label={t("on")}
                labelOff={t("off")}
                isChecked={field.value === "true"}
                onChange={(_event, value) => {
                  field.onChange(value.toString());
                }}
              />
            )}
          />
        </FormGroupField>
      )}
      {(!isSAML || isOIDC) && claimFilterRequired && (
        <>
          <FormGroup
            label={t("claimFilterName")}
            labelIcon={
              <HelpItem
                helpText={t("claimFilterNameHelp")}
                fieldLabelId="claimFilterName"
              />
            }
            fieldId="kc-claim-filter-name"
            isRequired
          >
            <TextInput
              isRequired
              id="kc-claim-filter-name"
              data-testid="claimFilterName"
              validated={
                errors.config?.claimFilterName
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
              {...register("config.claimFilterName", { required: true })}
            />
            {errors.config?.claimFilterName && (
              <FormErrorText message={t("required")} />
            )}
          </FormGroup>
          <FormGroup
            label={t("claimFilterValue")}
            labelIcon={
              <HelpItem
                helpText={t("claimFilterValueHelp")}
                fieldLabelId="claimFilterName"
              />
            }
            fieldId="kc-claim-filter-value"
            isRequired
          >
            <TextInput
              isRequired
              id="kc-claim-filter-value"
              data-testid="claimFilterValue"
              validated={
                errors.config?.claimFilterValue
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
              {...register("config.claimFilterValue", { required: true })}
            />
            {errors.config?.claimFilterValue && (
              <FormErrorText message={t("required")} />
            )}
          </FormGroup>
        </>
      )}
      <LoginFlow
        field="firstBrokerLoginFlowAlias"
        label="firstBrokerLoginFlowAliasOverride"
        defaultValue=""
        labelForEmpty=""
      />
      <LoginFlow
        field="postBrokerLoginFlowAlias"
        label="postBrokerLoginFlowAlias"
        defaultValue=""
      />

      {isTransientUsersEnabled && (
        <FormGroupField label="doNotStoreUsers">
          <Controller
            name="config.doNotStoreUsers"
            defaultValue="false"
            control={control}
            render={({ field }) => (
              <Switch
                id="doNotStoreUsers"
                label={t("on")}
                labelOff={t("off")}
                isChecked={field.value === "true"}
                onChange={(_event, value) => {
                  field.onChange(value.toString());
                  // if field is checked, set sync mode to import
                  if (value) {
                    setValue("config.syncMode", "IMPORT");
                  }
                }}
              />
            )}
          />
        </FormGroupField>
      )}
      {syncModeAvailable && (
        <SelectControl
          name="config.syncMode"
          label={t("syncMode")}
          labelIcon={t("syncModeHelp")}
          options={SYNC_MODES.map((syncMode) => ({
            key: syncMode,
            value: t(`syncModes.${syncMode.toLocaleLowerCase()}`),
          }))}
          controller={{
            defaultValue: SYNC_MODES[0],
            rules: { required: t("required") },
          }}
        />
      )}
      <SwitchField
        field="config.caseSensitiveOriginalUsername"
        label="caseSensitiveOriginalUsername"
      />
      {isClientAuthFederatedEnabled && isOIDC && (
        <SwitchField
          field="config.supportsClientAssertions"
          label="supportsClientAssertions"
        />
      )}
      {isClientAuthFederatedEnabled &&
        isOIDC &&
        supportsClientAssertions === "true" && (
          <SwitchField
            field="config.supportsClientAssertionReuse"
            label="supportsClientAssertionReuse"
          />
        )}
      {isOIDC &&
        ((isClientAuthFederatedEnabled &&
          supportsClientAssertions === "true") ||
          (jwtAuthorizationGrant &&
            jwtAuthorizationGrantEnabled === "true")) && (
          <SwitchField
            field="config.allowClientIdAsAudience"
            label="allowClientIdAsAudience"
          />
        )}
      {isOIDC &&
        ((isClientAuthFederatedEnabled &&
          supportsClientAssertions === "true") ||
          (jwtAuthorizationGrant &&
            jwtAuthorizationGrantEnabled === "true")) && (
          <FormGroupField label="fedClientAssertionMaxExp">
            <Controller
              name="config.fedClientAssertionMaxExp"
              defaultValue={""}
              control={control}
              render={({ field }) => (
                <TimeSelector
                  className="kc-fed-client-assertion-max-expiration-time"
                  data-testid="fed-client-assertion-max-expiration-time-input"
                  value={field.value!}
                  onChange={field.onChange}
                  units={["minute", "hour", "day"]}
                />
              )}
            />
          </FormGroupField>
        )}
    </>
  );
};
