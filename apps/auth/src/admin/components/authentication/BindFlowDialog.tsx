/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/BindFlowDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { SelectControl, useAlerts } from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { useRealm } from "../../context/realm-context/realm-context";
import { REALM_FLOWS } from "./constants";


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

type BindingForm = {
  bindingType: keyof RealmRepresentation;
};

type BindFlowDialogProps = {
  flowAlias: string;
  onClose: (used?: boolean) => void;
};

export const BindFlowDialog = ({ flowAlias, onClose }: BindFlowDialogProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm<BindingForm>();
  const { addAlert, addError } = useAlerts();
  const { realm, realmRepresentation: realmRep, refresh } = useRealm();

  const onSubmit = async ({ bindingType }: BindingForm) => {
    try {
      await adminClient.realms.update(
        { realm },
        { ...realmRep, [bindingType]: flowAlias },
      );
      refresh();
      addAlert(t("updateFlowSuccess"), AlertVariant.success);
    } catch (error) {
      addError("updateFlowError", error);
    }

    onClose(true);
  };

  const flowKeys = Array.from(REALM_FLOWS.keys());

  return (
    <Modal
      title={t("bindFlow")}
      variant="small"
      onClose={() => onClose()}
      actions={[
        <Button key="confirm" data-testid="save" type="submit" form="bind-form">
          {t("save")}
        </Button>,
        <Button
          data-testid="cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={() => onClose()}
        >
          {t("cancel")}
        </Button>,
      ]}
      isOpen
    >
      <Form id="bind-form" isHorizontal onSubmit={form.handleSubmit(onSubmit)}>
        <FormProvider {...form}>
          <SelectControl
            id="chooseBindingType"
            name="bindingType"
            label={t("chooseBindingType")}
            options={flowKeys
              .filter((f) => f !== "dockerAuthenticationFlow")
              .map((key) => ({
                key,
                value: t(`flow.${REALM_FLOWS.get(key)}`),
              }))}
            controller={{ defaultValue: flowKeys[0] }}
            menuAppendTo="parent"
            aria-label={t("chooseBindingType")}
          />
        </FormProvider>
      </Form>
    </Modal>
  );
};
