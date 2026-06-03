/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/initial-access/AccessTokenDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useTranslation } from "react-i18next";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";

const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};
const ClipboardCopy = ({ value, onChange, isReadOnly, isCode, hoverTip, clickTip, children, variant, ...props }: any) => {
  const [copied, setCopied] = React.useState(false);
  const text = value ?? children ?? "";
  return (
    <div className="flex items-stretch gap-0">
      <UIInput readOnly={isReadOnly} value={String(text)}
        onChange={(e: any) => onChange?.(e, e.target.value)} className="rounded-r-none" />
      <UIButton type="button" variant="outline" className="rounded-l-none"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(String(text));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}>
        {copied ? (clickTip ?? "Copied") : (hoverTip ?? "Copy")}
      </UIButton>
    </div>
  );
};
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const FormGroup = ({ label, fieldId, isRequired, labelIcon, helperText, helperTextInvalid, validated, children, ...props }: any) => (
  <div className={cn("space-y-1.5", (props as any).className)}>
    {label ? (
      <label htmlFor={fieldId} className="font-medium text-sm">
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
        {labelIcon}
      </label>
    ) : null}
    {children}
    {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
    {helperTextInvalid ? <p className="text-destructive text-xs">{helperTextInvalid}</p> : null}
  </div>
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

type AccessTokenDialogProps = {
  token: string;
  toggleDialog: () => void;
};

export const AccessTokenDialog = ({
  token,
  toggleDialog,
}: AccessTokenDialogProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t("initialAccessTokenDetails")}
      isOpen={true}
      onClose={toggleDialog}
      variant={ModalVariant.medium}
    >
      <Alert
        title={t("copyInitialAccessToken")}
        component="h2"
        isInline
        variant={AlertVariant.warning}
      />
      <Form className="pf-v5-u-mt-md">
        <FormGroup label={t("initialAccessToken")} fieldId="initialAccessToken">
          <ClipboardCopy
            id="initialAccessToken"
            data-testid="initialAccessToken"
            isReadOnly
          >
            {token}
          </ClipboardCopy>
        </FormGroup>
      </Form>
    </Modal>
  );
};
