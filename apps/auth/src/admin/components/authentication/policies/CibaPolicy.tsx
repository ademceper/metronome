/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/policies/CibaPolicy.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SelectControl, TextControl } from "../../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../form/FormAccess";
import { useRealm } from "../../../context/realm-context/RealmContext";
import { convertFormValuesToObject, convertToFormValues } from "../../../util";


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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

const CIBA_BACKHANNEL_TOKEN_DELIVERY_MODES = ["poll", "ping"] as const;
const CIBA_EXPIRES_IN_MIN = 10;
const CIBA_EXPIRES_IN_MAX = 600;
const CIBA_INTERVAL_MIN = 0;
const CIBA_INTERVAL_MAX = 600;

type CibaPolicyProps = {
  realm: RealmRepresentation;
  realmUpdated: (realm: RealmRepresentation) => void;
};

type FormFields = Omit<
  RealmRepresentation,
  "clients" | "components" | "groups"
>;

export const CibaPolicy = ({ realm, realmUpdated }: CibaPolicyProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm<FormFields>({ mode: "onChange" });
  const { realm: realmName } = useRealm();
  const { addAlert, addError } = useAlerts();

  const setupForm = (realm: RealmRepresentation) =>
    convertToFormValues(realm, form.setValue);

  useEffect(() => setupForm(realm), []);

  const onSubmit = async (formValues: FormFields) => {
    try {
      await adminClient.realms.update(
        { realm: realmName },
        convertFormValuesToObject(formValues),
      );

      const updatedRealm = await adminClient.realms.findOne({
        realm: realmName,
      });

      realmUpdated(updatedRealm!);
      setupForm(updatedRealm!);
      addAlert(t("updateCibaSuccess"), AlertVariant.success);
    } catch (error) {
      addError("updateCibaError", error);
    }
  };

  return (
    <PageSection variant="light">
      <FormAccess
        role="manage-realm"
        isHorizontal
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormProvider {...form}>
          <SelectControl
            name="attributes.cibaBackchannelTokenDeliveryMode"
            label={t("cibaBackchannelTokenDeliveryMode")}
            labelIcon={t("cibaBackchannelTokenDeliveryModeHelp")}
            options={CIBA_BACKHANNEL_TOKEN_DELIVERY_MODES.map((mode) => ({
              key: mode,
              value: t(`cibaBackhannelTokenDeliveryModes.${mode}`),
            }))}
            controller={{ defaultValue: "" }}
          />
          <TextControl
            name="attributes.cibaExpiresIn"
            type="number"
            min={CIBA_EXPIRES_IN_MIN}
            max={CIBA_EXPIRES_IN_MAX}
            label={t("cibaExpiresIn")}
            labelIcon={t("cibaExpiresInHelp")}
            rules={{
              min: {
                value: CIBA_EXPIRES_IN_MIN,
                message: t("greaterThan", {
                  value: CIBA_EXPIRES_IN_MIN,
                }),
              },
              max: {
                value: CIBA_EXPIRES_IN_MAX,
                message: t("lessThan", { value: CIBA_EXPIRES_IN_MAX }),
              },
              required: t("required"),
            }}
          />
          <TextControl
            name="attributes.cibaInterval"
            type="number"
            min={CIBA_EXPIRES_IN_MIN}
            max={CIBA_EXPIRES_IN_MAX}
            label={t("cibaInterval")}
            labelIcon={t("cibaIntervalHelp")}
            rules={{
              min: {
                value: CIBA_INTERVAL_MIN,
                message: t("greaterThan", {
                  value: CIBA_INTERVAL_MIN,
                }),
              },
              max: {
                value: CIBA_INTERVAL_MAX,
                message: t("lessThan", { value: CIBA_INTERVAL_MAX }),
              },
              required: t("required"),
            }}
          />
          <SelectControl
            name="attributes.cibaAuthRequestedUserHint"
            label={t("cibaAuthRequestedUserHint")}
            labelIcon={t("cibaAuthRequestedUserHintHelp")}
            options={["login_hint", "id_token_hint", "login_hint_token"]}
            controller={{ defaultValue: "" }}
            isDisabled
          />
        </FormProvider>
        <ActionGroup>
          <Button
            data-testid="save"
            variant="primary"
            type="submit"
            isDisabled={!form.formState.isValid || !form.formState.isDirty}
          >
            {t("save")}
          </Button>
          <Button
            data-testid="reload"
            variant={ButtonVariant.link}
            onClick={() => setupForm({ ...realm })}
          >
            {t("reload")}
          </Button>
        </ActionGroup>
      </FormAccess>
    </PageSection>
  );
};
