/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/policies/WebauthnPolicy.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Popover as UIPopover, PopoverContent as UIPopoverContent, PopoverTrigger as UIPopoverTrigger } from "@metronome/ui/components/popover";
import { cn } from "@metronome/ui/lib/utils";
import { Question as QuestionCircleIcon } from "@phosphor-icons/react"
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  HelpItem,
  SelectControl,
  SwitchControl,
  TextControl,
  useHelp,
} from "../../../../shared/keycloak-ui-shared";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../form/FormAccess";
import { MultiLineInput } from "../../multi-line-input/MultiLineInput";
import { TimeSelectorControl } from "../../time-selector/TimeSelectorControl";
import { useRealm } from "../../../context/realm-context/realm-context";
import { convertFormValuesToObject, convertToFormValues } from "../../../util";
import useIsFeatureEnabled, { Feature } from "../../../utils/use-is-feature-enabled";

import { useAdminClient } from "../../../admin-client";

const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Popover = ({ bodyContent, headerContent, footerContent, children, position, ...props }: any) => (
  <UIPopover {...props}>
    <UIPopoverTrigger asChild>{children}</UIPopoverTrigger>
    <UIPopoverContent>
      {headerContent ? (
        <div className="font-medium text-sm">{typeof headerContent === "function" ? headerContent() : headerContent}</div>
      ) : null}
      {bodyContent ? (
        <div className="text-sm">{typeof bodyContent === "function" ? bodyContent() : bodyContent}</div>
      ) : null}
      {footerContent ? (
        <div className="pt-2 text-sm">{typeof footerContent === "function" ? footerContent() : footerContent}</div>
      ) : null}
    </UIPopoverContent>
  </UIPopover>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);

const SIGNATURE_ALGORITHMS = [
  "ES256",
  "ES384",
  "ES512",
  "RS256",
  "RS384",
  "RS512",
  "Ed25519",
  "RS1",
] as const;
const ATTESTATION_PREFERENCE = [
  "not specified",
  "none",
  "indirect",
  "direct",
] as const;

const AUTHENTICATOR_ATTACHMENT = [
  "not specified",
  "platform",
  "cross-platform",
] as const;

const RESIDENT_KEY_OPTIONS = ["not specified", "Yes", "No"] as const;

const USER_VERIFY = [
  "not specified",
  "required",
  "preferred",
  "discouraged",
] as const;

type WeauthnSelectProps = {
  name: string;
  label: string;
  labelIcon?: string;
  options: readonly string[];
  labelPrefix?: string;
  isMultiSelect?: boolean;
};

const WebauthnSelect = ({
  name,
  label,
  labelIcon,
  options,
  labelPrefix,
  isMultiSelect = false,
}: WeauthnSelectProps) => {
  const { t } = useTranslation();
  return (
    <SelectControl
      name={name}
      label={label}
      labelIcon={labelIcon}
      variant={isMultiSelect ? "typeaheadMulti" : "single"}
      controller={{ defaultValue: options[0] }}
      options={options.map((option) => ({
        key: option,
        value: labelPrefix ? t(`${labelPrefix}.${option}`) : option,
      }))}
    />
  );
};

type WebauthnPolicyProps = {
  realm: RealmRepresentation;
  realmUpdated: (realm: RealmRepresentation) => void;
  isPasswordLess?: boolean;
};

export const WebauthnPolicy = ({
  realm,
  realmUpdated,
  isPasswordLess = false,
}: WebauthnPolicyProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const { realm: realmName } = useRealm();
  const { enabled } = useHelp();
  const form = useForm({ mode: "onChange" });
  const {
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = form;

  const namePrefix = isPasswordLess
    ? "webAuthnPolicyPasswordless"
    : "webAuthnPolicy";

  const setupForm = (realm: RealmRepresentation) =>
    convertToFormValues(realm, setValue);

  useEffect(() => setupForm(realm), []);

  const onSubmit = async (realm: RealmRepresentation) => {
    const submittedRealm = convertFormValuesToObject(realm);
    try {
      await adminClient.realms.update({ realm: realmName }, submittedRealm);
      realmUpdated(submittedRealm);
      setupForm(submittedRealm);
      addAlert(t("webAuthnUpdateSuccess"), AlertVariant.success);
    } catch (error) {
      addError("webAuthnUpdateError", error);
    }
  };

  const isFeatureEnabled = useIsFeatureEnabled();

  return (
    <PageSection variant="light">
      {enabled && (
        <Popover bodyContent={t(`${namePrefix}FormHelp`)}>
          <TextContent className="keycloak__section_intro__help">
            <Text>
              <QuestionCircleIcon /> {t("webauthnIntro")}
            </Text>
          </TextContent>
        </Popover>
      )}

      <FormAccess
        role="manage-realm"
        isHorizontal
        onSubmit={handleSubmit(onSubmit)}
        className="keycloak__webauthn_policies_authentication__form"
      >
        <FormProvider {...form}>
          <TextControl
            name={`${namePrefix}RpEntityName`}
            label={t("webAuthnPolicyRpEntityName")}
            labelIcon={t("webAuthnPolicyRpEntityNameHelp")}
            rules={{ required: t("required") }}
          />
          <WebauthnSelect
            name={`${namePrefix}SignatureAlgorithms`}
            label={t("webAuthnPolicySignatureAlgorithms")}
            labelIcon={t("webAuthnPolicySignatureAlgorithmsHelp")}
            options={SIGNATURE_ALGORITHMS}
            isMultiSelect
          />
          <TextControl
            name={`${namePrefix}RpId`}
            label={t("webAuthnPolicyRpId")}
            labelIcon={t("webAuthnPolicyRpIdHelp")}
          />
          <WebauthnSelect
            name={`${namePrefix}AttestationConveyancePreference`}
            label={t("webAuthnPolicyAttestationConveyancePreference")}
            labelIcon={t("webAuthnPolicyAttestationConveyancePreferenceHelp")}
            options={ATTESTATION_PREFERENCE}
            labelPrefix="attestationPreference"
          />
          <WebauthnSelect
            name={`${namePrefix}AuthenticatorAttachment`}
            label={t("webAuthnPolicyAuthenticatorAttachment")}
            labelIcon={t("webAuthnPolicyAuthenticatorAttachmentHelp")}
            options={AUTHENTICATOR_ATTACHMENT}
            labelPrefix="authenticatorAttachment"
          />
          <WebauthnSelect
            name={`${namePrefix}RequireResidentKey`}
            label={t("webAuthnPolicyRequireResidentKey")}
            labelIcon={t("webAuthnPolicyRequireResidentKeyHelp")}
            options={RESIDENT_KEY_OPTIONS}
            labelPrefix="residentKey"
          />
          <WebauthnSelect
            name={`${namePrefix}UserVerificationRequirement`}
            label={t("webAuthnPolicyUserVerificationRequirement")}
            labelIcon={t("webAuthnPolicyUserVerificationRequirementHelp")}
            options={USER_VERIFY}
            labelPrefix="userVerify"
          />
          <TimeSelectorControl
            name={`${namePrefix}CreateTimeout`}
            label={t("webAuthnPolicyCreateTimeout")}
            labelIcon={t("webAuthnPolicyCreateTimeoutHelp")}
            units={["second", "minute", "hour"]}
            controller={{
              defaultValue: 0,
              rules: {
                min: 0,
                max: {
                  value: 31536,
                  message: t("webAuthnPolicyCreateTimeoutHint"),
                },
              },
            }}
          />
          <SwitchControl
            name={`${namePrefix}AvoidSameAuthenticatorRegister`}
            label={t("webAuthnPolicyAvoidSameAuthenticatorRegister")}
            labelIcon={t("webAuthnPolicyAvoidSameAuthenticatorRegisterHelp")}
            labelOn={t("on")}
            labelOff={t("off")}
          />
          <FormGroup
            label={t("webAuthnPolicyAcceptableAaguids")}
            fieldId="webAuthnPolicyAcceptableAaguids"
            labelIcon={
              <HelpItem
                helpText={t("webAuthnPolicyAcceptableAaguidsHelp")}
                fieldLabelId="webAuthnPolicyAcceptableAaguids"
              />
            }
          >
            <MultiLineInput
              name={`${namePrefix}AcceptableAaguids`}
              aria-label={t("webAuthnPolicyAcceptableAaguids")}
              addButtonLabel="addAaguids"
            />
          </FormGroup>
          <FormGroup
            label={t("webAuthnPolicyExtraOrigins")}
            fieldId="webAuthnPolicyExtraOrigins"
            labelIcon={
              <HelpItem
                helpText={t("webAuthnPolicyExtraOriginsHelp")}
                fieldLabelId="webAuthnPolicyExtraOrigins"
              />
            }
          >
            <MultiLineInput
              name={`${namePrefix}ExtraOrigins`}
              aria-label={t("webAuthnPolicyExtraOrigins")}
              addButtonLabel="addOrigins"
            />
          </FormGroup>
          {isPasswordLess && isFeatureEnabled(Feature.Passkeys) && (
            <SwitchControl
              name={`${namePrefix}PasskeysEnabled`}
              label={t("webAuthnPolicyPasskeysEnabled")}
              labelIcon={t("webAuthnPolicyPasskeysEnabledHelp")}
              labelOn={t("on")}
              labelOff={t("off")}
            />
          )}
        </FormProvider>

        <ActionGroup>
          <Button
            data-testid="save"
            variant="primary"
            type="submit"
            isDisabled={!isDirty}
          >
            {t("save")}
          </Button>
          <Button
            data-testid="reload"
            variant={ButtonVariant.link}
            onClick={() => setupForm(realm)}
          >
            {t("reload")}
          </Button>
        </ActionGroup>
      </FormAccess>
    </PageSection>
  );
};
