/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/DuplicateFlowModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import AuthenticationFlowRepresentation from "@keycloak/keycloak-admin-client/lib/defs/authenticationFlowRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../admin-client";
import { useAlerts } from "../../shared/keycloak-ui-shared";
import { useRealm } from "../context/realm-context/RealmContext";
import { NameDescription } from "./form/NameDescription";
import { toFlow } from "./paths/Flow";


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
const ModalVariant = {
  small: "small",
  medium: "medium",
  large: "large",
  default: "default",
} as const;

type DuplicateFlowModalProps = {
  name: string;
  description: string;
  toggleDialog: () => void;
  onComplete: () => void;
};

export const DuplicateFlowModal = ({
  name,
  description,
  toggleDialog,
  onComplete,
}: DuplicateFlowModalProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm<AuthenticationFlowRepresentation>({
    mode: "onChange",
    defaultValues: {
      alias: t("copyOf", { name }),
      description: description,
    },
  });
  const { getValues, handleSubmit } = form;
  const { addAlert, addError } = useAlerts();
  const navigate = useNavigate();
  const { realm } = useRealm();

  const onSubmit = async () => {
    const form = getValues();
    try {
      await adminClient.authenticationManagement.copyFlow({
        flow: name,
        newName: form.alias!,
      });
      const newFlow = (
        await adminClient.authenticationManagement.getFlows()
      ).find((flow) => flow.alias === form.alias)!;

      if (form.description !== description) {
        newFlow.description = form.description;
        await adminClient.authenticationManagement.updateFlow(
          { flowId: newFlow.id! },
          newFlow,
        );
      }
      addAlert(t("copyFlowSuccess"), AlertVariant.success);
      navigate(
        toFlow({
          realm,
          id: newFlow.id!,
          usedBy: "notInUse",
          builtIn: newFlow.builtIn ? "builtIn" : undefined,
        }),
      );
    } catch (error) {
      addError("copyFlowError", error);
    }
    onComplete();
  };

  return (
    <Modal
      title={t("duplicateFlow")}
      onClose={toggleDialog}
      variant={ModalVariant.small}
      actions={[
        <Button
          key="confirm"
          data-testid="confirm"
          type="submit"
          form="duplicate-flow-form"
        >
          {t("duplicate")}
        </Button>,
        <Button
          key="cancel"
          data-testid="cancel"
          variant={ButtonVariant.link}
          onClick={toggleDialog}
        >
          {t("cancel")}
        </Button>,
      ]}
      isOpen
    >
      <FormProvider {...form}>
        <Form
          id="duplicate-flow-form"
          onSubmit={handleSubmit(onSubmit)}
          isHorizontal
        >
          <NameDescription />
        </Form>
      </FormProvider>
    </Modal>
  );
};
