/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/confirm-dialog/ConfirmDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { ReactElement, ReactNode, useState } from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";


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

export const useConfirmDialog = (
  props: ConfirmDialogProps,
): [() => void, () => ReactElement] => {
  const [show, setShow] = useState(false);

  function toggleDialog() {
    setShow((show) => !show);
  }

  const Dialog = () => (
    <ConfirmDialogModal
      key="confirmDialog"
      {...props}
      open={show}
      toggleDialog={toggleDialog}
    />
  );
  return [toggleDialog, Dialog];
};

export interface ConfirmDialogModalProps extends ConfirmDialogProps {
  open: boolean;
  toggleDialog: () => void;
}

export type ConfirmDialogProps = {
  titleKey: string;
  messageKey?: string;
  noCancelButton?: boolean;
  confirmButtonDisabled?: boolean;
  cancelButtonLabel?: string;
  continueButtonLabel?: string;
  continueButtonVariant?: ButtonVariant;
  variant?: ModalVariant;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: ReactNode;
};

export const ConfirmDialogModal = ({
  titleKey,
  messageKey,
  noCancelButton,
  cancelButtonLabel,
  continueButtonLabel,
  continueButtonVariant,
  onConfirm,
  onCancel,
  children,
  open = true,
  variant = ModalVariant.small,
  toggleDialog,
  confirmButtonDisabled,
}: ConfirmDialogModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t(titleKey)}
      isOpen={open}
      onClose={toggleDialog}
      variant={variant}
      actions={[
        <Button
          id="modal-confirm"
          data-testid="confirm"
          key="confirm"
          isDisabled={confirmButtonDisabled}
          variant={continueButtonVariant || ButtonVariant.primary}
          onClick={() => {
            onConfirm();
            toggleDialog();
          }}
        >
          {t(continueButtonLabel || "continue")}
        </Button>,
        !noCancelButton && (
          <Button
            id="modal-cancel"
            data-testid="cancel"
            key="cancel"
            variant={ButtonVariant.link}
            onClick={() => {
              if (onCancel) onCancel();
              toggleDialog();
            }}
          >
            {t(cancelButtonLabel || "cancel")}
          </Button>
        ),
      ]}
    >
      {!messageKey && children}
      {messageKey && t(messageKey)}
    </Modal>
  );
};
