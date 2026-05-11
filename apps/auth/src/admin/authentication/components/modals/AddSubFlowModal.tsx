/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/components/modals/AddSubFlowModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { AuthenticationProviderRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigRepresentation";
import {
  SelectControl,
  TextControl,
  useFetch,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";


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
const Modal = ({ isOpen, onClose, title, description, variant, actions, header, footer, children, ...props }: any) => (
  <UIDialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()}>
    <UIDialogContent {...props}>
      {(title || header) ? (
        <UIDialogHeader>
          {title ? <UIDialogTitle>{title}</UIDialogTitle> : null}
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
          {header}
        </UIDialogHeader>
      ) : null}
      {children}
      {(actions || footer) ? (
        <UIDialogFooter>
          {actions}
          {footer}
        </UIDialogFooter>
      ) : null}
    </UIDialogContent>
  </UIDialog>
);
const ModalVariant = {
  small: "small",
  medium: "medium",
  large: "large",
  default: "default",
} as const;

type AddSubFlowProps = {
  name: string;
  onConfirm: (flow: Flow) => void;
  onCancel: () => void;
};

const types = ["basic-flow", "form-flow"] as const;

export type Flow = {
  name: string;
  description: string;
  type: (typeof types)[number];
  provider: string;
};

export const AddSubFlowModal = ({
  name,
  onConfirm,
  onCancel,
}: AddSubFlowProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm<Flow>();
  const [formProviders, setFormProviders] =
    useState<AuthenticationProviderRepresentation[]>();

  useFetch(
    () => adminClient.authenticationManagement.getFormProviders(),
    setFormProviders,
    [],
  );

  useEffect(() => {
    if (formProviders?.length === 1) {
      form.setValue("provider", formProviders[0].id!);
    }
  }, [formProviders]);

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t("addSubFlowTo", { name })}
      onClose={onCancel}
      actions={[
        <Button
          key="add"
          data-testid="modal-add"
          type="submit"
          form="sub-flow-form"
        >
          {t("add")}
        </Button>,
        <Button
          key="cancel"
          data-testid="cancel"
          variant={ButtonVariant.link}
          onClick={onCancel}
        >
          {t("cancel")}
        </Button>,
      ]}
      isOpen
    >
      <Form
        id="sub-flow-form"
        onSubmit={form.handleSubmit(onConfirm)}
        isHorizontal
      >
        <FormProvider {...form}>
          <TextControl
            name="name"
            label={t("name")}
            labelIcon={t("clientIdHelp")}
            rules={{ required: t("required") }}
          />
          <TextControl
            name="description"
            label={t("description")}
            labelIcon={t("flowNameDescriptionHelp")}
          />
          <SelectControl
            name="type"
            menuAppendTo="parent"
            label={t("flowType")}
            options={types.map((type) => ({
              key: type,
              value: t(`flow-type.${type}`),
            }))}
            controller={{ defaultValue: types[0] }}
          />
          {formProviders && formProviders.length > 1 && (
            <SelectControl
              name="provider"
              label={t("provider")}
              labelIcon={t("authenticationFlowTypeHelp")}
              options={formProviders.map((provider) => ({
                key: provider.id!,
                value: provider.displayName!,
              }))}
              controller={{ defaultValue: "" }}
            />
          )}
        </FormProvider>
      </Form>
    </Modal>
  );
};
