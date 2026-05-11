/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/continue-cancel/ContinueCancelModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { ReactNode, useState } from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";

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
type ButtonProps = React.ComponentProps<typeof Button>;
type ModalProps = React.ComponentProps<typeof Modal>;

export type ContinueCancelModalProps = Omit<ModalProps, "ref" | "children"> & {
  modalTitle: string;
  continueLabel: string;
  cancelLabel: string;
  buttonTitle: string | ReactNode;
  buttonVariant?: ButtonProps["variant"];
  buttonTestRole?: string;
  isDisabled?: boolean;
  onContinue: () => void;
  component?: React.ElementType<any> | React.ComponentType<any>;
  children?: ReactNode;
};

export const ContinueCancelModal = ({
  modalTitle,
  continueLabel,
  cancelLabel,
  buttonTitle,
  isDisabled,
  buttonVariant,
  buttonTestRole,
  onContinue,
  component = Button,
  children,
  ...rest
}: ContinueCancelModalProps) => {
  const [open, setOpen] = useState(false);
  const Component = component;

  return (
    <>
      <Component
        variant={buttonVariant}
        onClick={() => setOpen(true)}
        isDisabled={isDisabled}
        data-testrole={buttonTestRole}
      >
        {buttonTitle}
      </Component>
      <Modal
        variant="small"
        {...rest}
        title={modalTitle}
        isOpen={open}
        onClose={() => setOpen(false)}
        actions={[
          <Button
            id="modal-confirm"
            key="confirm"
            variant="primary"
            onClick={() => {
              setOpen(false);
              onContinue();
            }}
          >
            {continueLabel}
          </Button>,
          <Button
            id="modal-cancel"
            key="cancel"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            {cancelLabel}
          </Button>,
        ]}
      >
        {children}
      </Modal>
    </>
  );
};
