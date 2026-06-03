/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/security-defences/BruteForceDetection.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import {
  HelpItem,
  KeycloakSelect,
  NumberControl,
  SelectVariant,
  SelectControl,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormAccess } from "../../form/form-access";
import { convertToFormValues } from "../../../util";
import { Time } from "./time";
import { SelectOption } from "../../../../shared/pf-compat"


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

type BruteForceDetectionProps = {
  realm: RealmRepresentation;
  save: (realm: RealmRepresentation) => void;
};

export const BruteForceDetection = ({
  realm,
  save,
}: BruteForceDetectionProps) => {
  const { t } = useTranslation();
  const form = useForm();
  const {
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = form;

  const [isBruteForceModeOpen, setIsBruteForceModeOpen] = useState(false);
  const [isBruteForceModeUpdated, setIsBruteForceModeUpdated] = useState(false);

  enum BruteForceMode {
    Disabled = "Disabled",
    PermanentLockout = "PermanentLockout",
    TemporaryLockout = "TemporaryLockout",
    PermanentAfterTemporaryLockout = "PermanentAfterTemporaryLockout",
  }

  const bruteForceModes = [
    BruteForceMode.Disabled,
    BruteForceMode.PermanentLockout,
    BruteForceMode.TemporaryLockout,
    BruteForceMode.PermanentAfterTemporaryLockout,
  ];

  const bruteForceStrategyTypes = ["MULTIPLE", "LINEAR"];

  const setupForm = () => {
    convertToFormValues(realm, setValue);
    setIsBruteForceModeUpdated(false);
  };
  useEffect(setupForm, [realm]);

  const bruteForceMode = (() => {
    if (!form.getValues("bruteForceProtected")) {
      return BruteForceMode.Disabled;
    }
    if (!form.getValues("permanentLockout")) {
      return BruteForceMode.TemporaryLockout;
    }
    return form.getValues("maxTemporaryLockouts") == 0
      ? BruteForceMode.PermanentLockout
      : BruteForceMode.PermanentAfterTemporaryLockout;
  })();

  return (
    <FormProvider {...form}>
      <FormAccess
        role="manage-realm"
        isHorizontal
        onSubmit={handleSubmit(save)}
      >
        <FormGroup
          label={t("bruteForceMode")}
          fieldId="kc-brute-force-mode"
          labelIcon={
            <HelpItem
              helpText={t("bruteForceModeHelpText")}
              fieldLabelId="bruteForceMode"
            />
          }
        >
          <KeycloakSelect
            toggleId="kc-brute-force-mode"
            onToggle={() => setIsBruteForceModeOpen(!isBruteForceModeOpen)}
            onSelect={(value) => {
              switch (value as BruteForceMode) {
                case BruteForceMode.Disabled:
                  form.setValue("bruteForceProtected", false);
                  form.setValue("permanentLockout", false);
                  form.setValue("maxTemporaryLockouts", 0);
                  break;
                case BruteForceMode.TemporaryLockout:
                  form.setValue("bruteForceProtected", true);
                  form.setValue("permanentLockout", false);
                  form.setValue("maxTemporaryLockouts", 0);
                  break;
                case BruteForceMode.PermanentLockout:
                  form.setValue("bruteForceProtected", true);
                  form.setValue("permanentLockout", true);
                  form.setValue("maxTemporaryLockouts", 0);
                  break;
                case BruteForceMode.PermanentAfterTemporaryLockout:
                  form.setValue("bruteForceProtected", true);
                  form.setValue("permanentLockout", true);
                  form.setValue("maxTemporaryLockouts", 1);
                  break;
              }
              setIsBruteForceModeUpdated(true);
              setIsBruteForceModeOpen(false);
            }}
            selections={bruteForceMode}
            variant={SelectVariant.single}
            isOpen={isBruteForceModeOpen}
            data-testid="select-brute-force-mode"
            aria-label={t("selectUnmanagedAttributePolicy")}
          >
            {bruteForceModes.map((mode) => (
              <SelectOption key={mode} value={mode}>
                {t(`bruteForceMode.${mode}`)}
              </SelectOption>
            ))}
          </KeycloakSelect>
        </FormGroup>
        {bruteForceMode !== BruteForceMode.Disabled && (
          <>
            <NumberControl
              name="failureFactor"
              label={t("failureFactor")}
              labelIcon={t("failureFactorHelp")}
              controller={{
                defaultValue: 0,
                rules: { required: t("required"), min: 0 },
              }}
            />
            <NumberControl
              name="maxSecondaryAuthFailures"
              label={t("maxSecondaryAuthFailures")}
              labelIcon={t("maxSecondaryAuthFailuresHelp")}
              controller={{
                defaultValue: 100,
                rules: { required: t("required"), min: 0 },
              }}
            />
            {bruteForceMode ===
              BruteForceMode.PermanentAfterTemporaryLockout && (
              <NumberControl
                name="maxTemporaryLockouts"
                label={t("maxTemporaryLockouts")}
                labelIcon={t("maxTemporaryLockoutsHelp")}
                controller={{
                  defaultValue: 0,
                  rules: { min: 0 },
                }}
              />
            )}
            {(bruteForceMode === BruteForceMode.TemporaryLockout ||
              bruteForceMode ===
                BruteForceMode.PermanentAfterTemporaryLockout) && (
              <>
                <SelectControl
                  name="bruteForceStrategy"
                  label={t("bruteForceStrategy")}
                  labelIcon={t("bruteForceStrategyHelp", {
                    failureFactor: form.getValues("failureFactor"),
                  })}
                  controller={{ defaultValue: "" }}
                  options={bruteForceStrategyTypes.map((key) => ({
                    key,
                    value: t(`bruteForceStrategy.${key}`),
                  }))}
                />
                <Time name="waitIncrementSeconds" min={0} />
                <Time name="maxFailureWaitSeconds" min={0} />
                <Time name="maxDeltaTimeSeconds" min={0} />
              </>
            )}
            <NumberControl
              name="quickLoginCheckMilliSeconds"
              label={t("quickLoginCheckMilliSeconds")}
              labelIcon={t("quickLoginCheckMilliSecondsHelp")}
              controller={{
                defaultValue: 0,
                rules: { min: 0 },
              }}
            />
            <Time name="minimumQuickLoginWaitSeconds" min={0} />
          </>
        )}

        <ActionGroup>
          <Button
            variant="primary"
            type="submit"
            data-testid="brute-force-tab-save"
            isDisabled={!isDirty && !isBruteForceModeUpdated}
          >
            {t("save")}
          </Button>
          <Button variant="link" onClick={setupForm}>
            {t("revert")}
          </Button>
        </ActionGroup>
      </FormAccess>
    </FormProvider>
  );
};
