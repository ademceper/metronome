/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/UserFederationKerberosSettings.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import { useAlerts, useFetch } from "../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../admin-client";
import { useRealm } from "../context/realm-context/RealmContext";
import { useParams } from "../utils/useParams";
import { KerberosSettingsRequired } from "./kerberos/KerberosSettingsRequired";
import { toUserFederation } from "./routes/UserFederation";
import { Header } from "./shared/Header";
import { SettingsCache } from "./shared/SettingsCache";


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
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);

export default function UserFederationKerberosSettings() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm<ComponentRepresentation>({ mode: "onChange" });
  const navigate = useNavigate();
  const { realm } = useRealm();

  const { id } = useParams<{ id?: string }>();

  const { addAlert, addError } = useAlerts();

  useFetch(
    async () => {
      if (id) {
        return adminClient.components.findOne({ id });
      }
    },
    (fetchedComponent) => {
      if (fetchedComponent) {
        setupForm(fetchedComponent);
      } else if (id) {
        throw new Error(t("notFound"));
      }
    },
    [],
  );

  const setupForm = (component: ComponentRepresentation) => {
    form.reset({ ...component });
  };

  const save = async (component: ComponentRepresentation) => {
    try {
      if (!id) {
        await adminClient.components.create(component);
        navigate(`/${realm}/user-federation`);
      } else {
        await adminClient.components.update({ id }, component);
      }
      setupForm(component as ComponentRepresentation);
      addAlert(
        t(!id ? "createUserProviderSuccess" : "userProviderSaveSuccess"),
        AlertVariant.success,
      );
    } catch (error) {
      addError(
        !id ? "createUserProviderError" : "userProviderSaveError",
        error,
      );
    }
  };

  return (
    <FormProvider {...form}>
      <Header provider="Kerberos" save={() => form.handleSubmit(save)()} />
      <PageSection variant="light">
        <KerberosSettingsRequired form={form} showSectionHeading />
      </PageSection>
      <PageSection variant="light" isFilled>
        <SettingsCache form={form} showSectionHeading />
        <Form onSubmit={form.handleSubmit(save)}>
          <ActionGroup>
            <Button
              isDisabled={!form.formState.isDirty}
              variant="primary"
              type="submit"
              data-testid="kerberos-save"
            >
              {t("save")}
            </Button>
            <Button
              variant="link"
              onClick={() => navigate(toUserFederation({ realm }))}
              data-testid="kerberos-cancel"
            >
              {t("cancel")}
            </Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </FormProvider>
  );
}
