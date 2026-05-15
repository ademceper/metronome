/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/AuthorizationDataModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type AccessTokenRepresentation from "@keycloak/keycloak-admin-client/lib/defs/accessTokenRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Textarea as UITextarea } from "@metronome/ui/components/textarea";
import { cn } from "@metronome/ui/lib/utils";
import { useTranslation } from "react-i18next";

import { prettyPrintJSON } from "../../../util";
import useToggle from "../../../utils/useToggle";


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
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextArea = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, ...props }: any) => (
  <UITextarea value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired} {...props} />
);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TextVariants = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "blockquote", pre: "pre", a: "a",
} as const;

type AuthorizationDataModalProps = {
  data: AccessTokenRepresentation;
};

export const AuthorizationDataModal = ({
  data,
}: AuthorizationDataModalProps) => {
  const { t } = useTranslation();
  const [show, toggle] = useToggle();

  return (
    <>
      <Button
        data-testid="authorization-revert"
        onClick={toggle}
        variant="secondary"
      >
        {t("showAuthData")}
      </Button>
      <Modal
        variant={ModalVariant.medium}
        isOpen={show}
        aria-label={t("authData")}
        header={
          <TextContent>
            <Text component={TextVariants.h1}>{t("authData")}</Text>
            <Text>{t("authDataDescription")}</Text>
          </TextContent>
        }
        onClose={toggle}
        actions={[
          <Button
            data-testid="cancel"
            id="modal-cancel"
            key="cancel"
            onClick={toggle}
          >
            {t("cancel")}
          </Button>,
        ]}
      >
        <TextArea readOnly rows={20} value={prettyPrintJSON(data)} />
      </Modal>
    </>
  );
};
