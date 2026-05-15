/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/form/CreateFlow.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type AuthenticationFlowRepresentation from "@keycloak/keycloak-admin-client/lib/defs/authenticationFlowRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  FormSubmitButton,
  SelectControl,
} from "../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../components/form/FormAccess";
import { ViewHeader } from "../../components/view-header/ViewHeader";
import { useRealm } from "../../context/realm-context/RealmContext";
import { toAuthentication } from "../paths/Authentication";
import { toFlow } from "../paths/Flow";
import { NameDescription } from "./NameDescription";


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

const TYPES = ["basic-flow", "client-flow"] as const;

export default function CreateFlow() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { realm } = useRealm();
  const { addAlert } = useAlerts();
  const form = useForm<AuthenticationFlowRepresentation>();
  const { handleSubmit, formState } = form;

  const onSubmit = async (formValues: AuthenticationFlowRepresentation) => {
    const flow = { ...formValues, builtIn: false, topLevel: true };

    try {
      const { id } =
        await adminClient.authenticationManagement.createFlow(flow);
      addAlert(t("flowCreatedSuccess"), AlertVariant.success);
      navigate(
        toFlow({
          realm,
          id: id!,
          usedBy: "notInUse",
        }),
      );
    } catch (error: any) {
      addAlert(
        t("flowCreateError", {
          error: error.response?.data?.errorMessage || error,
        }),
        AlertVariant.danger,
      );
    }
  };

  return (
    <>
      <ViewHeader titleKey="createFlow" subKey="authenticationCreateFlowHelp" />
      <PageSection variant="light">
        <FormProvider {...form}>
          <FormAccess
            isHorizontal
            role="manage-authorization"
            onSubmit={handleSubmit(onSubmit)}
          >
            <NameDescription />
            <SelectControl
              name="providerId"
              label={t("flowType")}
              labelIcon={t("topLevelFlowTypeHelp")}
              aria-label={t("selectFlowType")}
              controller={{ defaultValue: TYPES[0] }}
              options={TYPES.map((type) => ({
                key: type,
                value: t(`top-level-flow-type.${type}`),
              }))}
            />
            <ActionGroup>
              <FormSubmitButton
                formState={formState}
                data-testid="create"
                allowInvalid
                allowNonDirty
              >
                {t("create")}
              </FormSubmitButton>
              <Button
                data-testid="cancel"
                variant="link"
                component={(props) => (
                  <Link {...props} to={toAuthentication({ realm })}></Link>
                )}
              >
                {t("cancel")}
              </Button>
            </ActionGroup>
          </FormAccess>
        </FormProvider>
      </PageSection>
    </>
  );
}
