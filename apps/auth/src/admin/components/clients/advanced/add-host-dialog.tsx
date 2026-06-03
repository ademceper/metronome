/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/advanced/AddHostDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextControl } from "../../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";


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

type FormFields = {
  node: string;
};

type AddHostDialogProps = {
  clientId: string;
  isOpen: boolean;
  onAdded: (host: string) => void;
  onClose: () => void;
};

export const AddHostDialog = ({
  clientId: id,
  isOpen,
  onAdded,
  onClose,
}: AddHostDialogProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm<FormFields>();
  const {
    handleSubmit,
    formState: { isDirty, isValid },
  } = form;
  const { addAlert, addError } = useAlerts();

  async function onSubmit({ node }: FormFields) {
    try {
      await adminClient.clients.addClusterNode({
        id,
        node,
      });
      onAdded(node);
      addAlert(t("addedNodeSuccess"), AlertVariant.success);
    } catch (error) {
      addError("addedNodeFail", error);
    }

    onClose();
  }

  return (
    <Modal
      title={t("addNode")}
      isOpen={isOpen}
      onClose={onClose}
      variant="small"
      actions={[
        <Button
          key="confirm"
          id="add-node-confirm"
          type="submit"
          form="add-host-form"
          isDisabled={!isDirty || !isValid}
        >
          {t("save")}
        </Button>,
        <Button
          key="cancel"
          id="add-node-cancel"
          variant={ButtonVariant.link}
          onClick={onClose}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <FormProvider {...form}>
        <Form id="add-host-form" onSubmit={handleSubmit(onSubmit)} isHorizontal>
          <TextControl
            name="node"
            label={t("nodeHost")}
            rules={{
              required: t("required"),
            }}
          />
        </Form>
      </FormProvider>
    </Modal>
  );
};
