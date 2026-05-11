/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/event-config/EventListenersForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  KeycloakSpinner,
  useFetch,
  SelectControl,
  SelectVariant,
} from "../../../shared/keycloak-ui-shared";
import { useState } from "react";
import { fetchAdminUI } from "../../context/auth/admin-ui-endpoint";
import { useAdminClient } from "../../admin-client";


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

type EventListenerRepresentation = {
  id: string;
};

type EventListenersFormProps = {
  form: UseFormReturn;
  reset: () => void;
};

export const EventListenersForm = ({
  form,
  reset,
}: EventListenersFormProps) => {
  const { t } = useTranslation();

  const [eventListeners, setEventListeners] =
    useState<EventListenerRepresentation[]>();

  const { adminClient } = useAdminClient();

  useFetch(
    () =>
      fetchAdminUI<EventListenerRepresentation[]>(
        adminClient,
        "ui-ext/available-event-listeners",
      ),
    setEventListeners,
    [],
  );

  if (!eventListeners) {
    return <KeycloakSpinner />;
  }

  return (
    <FormProvider {...form}>
      <SelectControl
        name="eventsListeners"
        label={t("eventListeners")}
        labelIcon={t("eventListenersHelpTextHelp")}
        controller={{
          defaultValue: "",
        }}
        className="kc_eventListeners_select"
        chipGroupProps={{
          numChips: 3,
          expandedText: t("hide"),
          collapsedText: t("showRemaining"),
        }}
        variant={SelectVariant.typeaheadMulti}
        options={eventListeners.map((value) => value.id)}
      />
      <ActionGroup>
        <Button
          variant="primary"
          type="submit"
          data-testid={"saveEventListenerBtn"}
        >
          {t("save")}
        </Button>
        <Button
          variant="link"
          data-testid={"revertEventListenerBtn"}
          onClick={reset}
        >
          {t("revert")}
        </Button>
      </ActionGroup>
    </FormProvider>
  );
};
