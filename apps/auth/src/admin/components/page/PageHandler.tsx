/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/page/PageHandler.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import ComponentTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentTypeRepresentation";
import {
  KeycloakSpinner,
  useAlerts,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { DynamicComponents } from "../dynamic/DynamicComponents";
import { useRealm } from "../../context/realm-context/RealmContext";
import { useParams } from "../../utils/useParams";
import { type PAGE_PROVIDER, TAB_PROVIDER } from "./constants";
import { toPage } from "../../lib/page";


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

type PageHandlerProps = {
  id?: string;
  providerType: typeof TAB_PROVIDER | typeof PAGE_PROVIDER;
  page: ComponentTypeRepresentation;
};

export const PageHandler = ({
  id: idAttribute,
  providerType,
  page: { id: providerId, ...page },
}: PageHandlerProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm<ComponentTypeRepresentation>();
  const { realm: realmName, realmRepresentation: realm } = useRealm();
  const { addAlert, addError } = useAlerts();
  const [id, setId] = useState(idAttribute);
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);

  useFetch(
    async () =>
      await Promise.all([
        id ? adminClient.components.findOne({ id }) : Promise.resolve(),
        providerType === TAB_PROVIDER
          ? adminClient.components.find({ type: TAB_PROVIDER })
          : Promise.resolve(),
      ]),
    ([data, tabs]) => {
      const tab = (tabs || []).find((t) => t.providerId === providerId);
      form.reset(data || tab || {});
      if (tab) setId(tab.id);
      setIsLoading(false);
    },
    [],
  );

  const onSubmit = async (component: ComponentRepresentation) => {
    if (component.config || params) {
      component.config = Object.assign(component.config || {}, params);
      Object.entries(component.config).forEach(
        ([key, value]) =>
          (component.config![key] = Array.isArray(value) ? value : [value]),
      );
    }
    try {
      const updatedComponent = {
        ...component,
        providerId,
        providerType,
        parentId: realm?.id,
      };
      if (id) {
        await adminClient.components.update({ id }, updatedComponent);
      } else {
        const { id } = await adminClient.components.create(updatedComponent);
        setId(id);
      }
      addAlert(t("itemSaveSuccessful"));
    } catch (error) {
      addError("itemSaveError", error);
    }
  };

  if (isLoading) {
    return <KeycloakSpinner />;
  }

  return (
    <PageSection variant="light">
      <Form
        isHorizontal
        onSubmit={form.handleSubmit(onSubmit)}
        className="keycloak__form"
      >
        <FormProvider {...form}>
          <DynamicComponents properties={page.properties} />
        </FormProvider>

        <ActionGroup>
          <Button data-testid="save" type="submit">
            {t("save")}
          </Button>
          <Button
            variant="link"
            component={(props) => (
              <Link
                {...props}
                to={toPage({ realm: realmName, providerId: providerId! })}
              />
            )}
          >
            {t("cancel")}
          </Button>
        </ActionGroup>
      </Form>
    </PageSection>
  );
};
