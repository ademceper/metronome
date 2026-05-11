/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/policies/OtpPolicy.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import {
  HelpItem,
  NumberControl,
  SelectControl,
  SwitchControl,
  useAlerts,
} from "../../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useMemo } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { FormAccess } from "../../components/form/FormAccess";
import { TimeSelectorControl } from "../../components/time-selector/TimeSelectorControl";
import { useRealm } from "../../context/realm-context/RealmContext";
import useLocaleSort from "../../utils/useLocaleSort";

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
const Chip = ({ onClick, children, ...props }: any) => (
  <UIBadge variant="secondary" {...props}>
    {children}
    {onClick ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </UIBadge>
);
const ChipGroup = ({ categoryName, numChips, onClick, isClosable, children, ...props }: any) => (
  <div className="flex flex-wrap items-center gap-1" {...props}>
    {categoryName ? <span className="text-muted-foreground text-xs">{categoryName}:</span> : null}
    {children}
    {isClosable ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </div>
);
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
const Radio = ({ id, name, label, description, isChecked, onChange, isDisabled, value, ...props }: any) => (
  <div className="flex items-start gap-2">
    <input type="radio" id={id} name={name} value={value} checked={!!isChecked} disabled={isDisabled}
      onChange={(e) => onChange?.(e, e.target.checked)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
);

const POLICY_TYPES = ["totp", "hotp"] as const;
const OTP_HASH_ALGORITHMS = ["SHA1", "SHA256", "SHA512"] as const;
const NUMBER_OF_DIGITS = [6, 8] as const;

type OtpPolicyProps = {
  realm: RealmRepresentation;
  realmUpdated: (realm: RealmRepresentation) => void;
};

type FormFields = Omit<
  RealmRepresentation,
  "clients" | "components" | "groups" | "users" | "federatedUsers"
>;

export const OtpPolicy = ({ realm, realmUpdated }: OtpPolicyProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm<FormFields>({
    mode: "onChange",
    defaultValues: {
      otpPolicyType: realm.otpPolicyType ?? POLICY_TYPES[0],
      otpPolicyAlgorithm:
        realm.otpPolicyAlgorithm ?? `Hmac${OTP_HASH_ALGORITHMS[0]}`,
      otpPolicyDigits: realm.otpPolicyDigits ?? NUMBER_OF_DIGITS[0],
      otpPolicyLookAheadWindow: realm.otpPolicyLookAheadWindow ?? 1,
      otpPolicyPeriod: realm.otpPolicyPeriod ?? 30,
      otpPolicyInitialCounter: realm.otpPolicyInitialCounter ?? 30,
      otpPolicyCodeReusable: realm.otpPolicyCodeReusable ?? false,
    },
  });
  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid, isDirty },
  } = form;
  const { realm: realmName } = useRealm();
  const { addAlert, addError } = useAlerts();
  const localeSort = useLocaleSort();

  const otpType = useWatch({ name: "otpPolicyType", control });

  const setupForm = (formValues: FormFields) => reset(formValues);

  const supportedApplications = useMemo(() => {
    const labels = (realm.otpSupportedApplications ?? []).map((key) =>
      t(`otpSupportedApplications.${key}`),
    );

    return localeSort(labels, (label) => label);
  }, [realm.otpSupportedApplications]);

  const onSubmit = async (formValues: FormFields) => {
    try {
      await adminClient.realms.update({ realm: realmName }, formValues);
      const updatedRealm = await adminClient.realms.findOne({
        realm: realmName,
      });
      realmUpdated(updatedRealm!);
      setupForm(updatedRealm!);
      addAlert(t("updateOtpSuccess"), AlertVariant.success);
    } catch (error) {
      addError("updateOtpError", error);
    }
  };

  return (
    <PageSection variant="light">
      <FormAccess
        role="manage-realm"
        isHorizontal
        onSubmit={handleSubmit(onSubmit)}
        className="keycloak__otp_policies_authentication__form"
      >
        <FormProvider {...form}>
          <FormGroup
            label={t("otpType")}
            labelIcon={
              <HelpItem helpText={t("otpTypeHelp")} fieldLabelId="otpType" />
            }
            hasNoPaddingTop
          >
            <Controller
              name="otpPolicyType"
              data-testid="otpPolicyType"
              defaultValue={POLICY_TYPES[0]}
              control={control}
              render={({ field: { value, onChange } }) => (
                <>
                  {POLICY_TYPES.map((type) => (
                    <Radio
                      key={type}
                      id={type}
                      data-testid={type}
                      isChecked={value === type}
                      name="otpPolicyType"
                      onChange={() => onChange(type)}
                      label={t(`policyType.${type}`)}
                      className="keycloak__otp_policies_authentication__policy-type"
                    />
                  ))}
                </>
              )}
            />
          </FormGroup>
          <SelectControl
            name="otpPolicyAlgorithm"
            label={t("otpHashAlgorithm")}
            labelIcon={t("otpHashAlgorithmHelp")}
            options={OTP_HASH_ALGORITHMS.map((type) => ({
              key: `Hmac${type}`,
              value: type,
            }))}
            controller={{ defaultValue: `Hmac${OTP_HASH_ALGORITHMS[0]}` }}
          />
          <FormGroup
            label={t("otpPolicyDigits")}
            labelIcon={
              <HelpItem
                helpText={t("otpPolicyDigitsHelp")}
                fieldLabelId="otpPolicyDigits"
              />
            }
            hasNoPaddingTop
          >
            <Controller
              name="otpPolicyDigits"
              data-testid="otpPolicyDigits"
              defaultValue={NUMBER_OF_DIGITS[0]}
              control={control}
              render={({ field }) => (
                <>
                  {NUMBER_OF_DIGITS.map((type) => (
                    <Radio
                      key={type}
                      id={`digit-${type}`}
                      data-testid={`digit-${type}`}
                      isChecked={field.value === type}
                      name="otpPolicyDigits"
                      onChange={() => field.onChange(type)}
                      label={type}
                      className="keycloak__otp_policies_authentication__number-of-digits"
                    />
                  ))}
                </>
              )}
            />
          </FormGroup>
          <NumberControl
            name="otpPolicyLookAheadWindow"
            label={t("lookAround")}
            labelIcon={t("lookAroundHelp")}
            controller={{ defaultValue: 1, rules: { min: 0 } }}
          />
          {otpType === POLICY_TYPES[0] && (
            <TimeSelectorControl
              name="otpPolicyPeriod"
              label={t("otpPolicyPeriod")}
              labelIcon={t("otpPolicyPeriodHelp")}
              units={["second", "minute"]}
              controller={{
                defaultValue: 30,
                rules: {
                  min: 1,
                  max: {
                    value: 120,
                    message: t("maxLength", { length: "2 " + t("minutes") }),
                  },
                },
              }}
            />
          )}
          {otpType === POLICY_TYPES[1] && (
            <NumberControl
              name="otpPolicyInitialCounter"
              label={t("initialCounter")}
              labelIcon={t("initialCounterHelp")}
              controller={{ defaultValue: 30, rules: { min: 1, max: 120 } }}
            />
          )}
          <FormGroup
            label={t("supportedApplications")}
            labelIcon={
              <HelpItem
                helpText={t("supportedApplicationsHelp")}
                fieldLabelId="supportedApplications"
              />
            }
          >
            <span data-testid="supportedApplications">
              <ChipGroup>
                {supportedApplications.map((label) => (
                  <Chip key={label} isReadOnly>
                    {label}
                  </Chip>
                ))}
              </ChipGroup>
            </span>
          </FormGroup>

          {otpType === POLICY_TYPES[0] && (
            <SwitchControl
              name="otpPolicyCodeReusable"
              label={t("otpPolicyCodeReusable")}
              labelIcon={t("otpPolicyCodeReusableHelp")}
              labelOn={t("on")}
              labelOff={t("off")}
            />
          )}

          <ActionGroup>
            <Button
              data-testid="save"
              variant="primary"
              type="submit"
              isDisabled={!isValid || !isDirty}
            >
              {t("save")}
            </Button>
            <Button
              data-testid="reload"
              variant={ButtonVariant.link}
              onClick={() => reset({ ...realm })}
            >
              {t("reload")}
            </Button>
          </ActionGroup>
        </FormProvider>
      </FormAccess>
    </PageSection>
  );
};
