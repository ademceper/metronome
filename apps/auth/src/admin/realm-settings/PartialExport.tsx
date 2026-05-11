/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/PartialExport.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { saveAs } from "file-saver";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../admin-client";
import { useAlerts } from "../../shared/keycloak-ui-shared";
import { useRealm } from "../context/realm-context/RealmContext";
import { prettyPrintJSON } from "../util";

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
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);

export type PartialExportDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const PartialExportDialog = ({
  isOpen,
  onClose,
}: PartialExportDialogProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();

  const [exportGroupsAndRoles, setExportGroupsAndRoles] = useState(false);
  const [exportClients, setExportClients] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const showWarning = exportGroupsAndRoles || exportClients;

  async function exportRealm() {
    setIsExporting(true);

    try {
      const realmExport = await adminClient.realms.export({
        realm,
        exportClients,
        exportGroupsAndRoles,
      });

      saveAs(
        new Blob([prettyPrintJSON(realmExport)], {
          type: "application/json",
        }),
        "realm-export.json",
      );

      addAlert(t("exportSuccess"), AlertVariant.success);
      onClose();
    } catch (error) {
      addError("exportFail", error);
    }

    setIsExporting(false);
  }

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("partialExport")}
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button
          key="export"
          data-testid="confirm"
          isDisabled={isExporting}
          onClick={exportRealm}
        >
          {t("export")}
        </Button>,
        <Button
          key="cancel"
          data-testid="cancel"
          variant={ButtonVariant.link}
          onClick={onClose}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <TextContent>
        <Text>{t("partialExportHeaderText")}</Text>
      </TextContent>
      <Form
        isHorizontal
        className="keycloak__realm-settings__partial-import_form"
      >
        <FormGroup
          label={t("includeGroupsAndRoles")}
          fieldId="include-groups-and-roles-check"
          hasNoPaddingTop
        >
          <Switch
            id="include-groups-and-roles-check"
            data-testid="include-groups-and-roles-check"
            isChecked={exportGroupsAndRoles}
            onChange={(_event, val) => setExportGroupsAndRoles(val)}
            label={t("on")}
            labelOff={t("off")}
            aria-label={t("includeGroupsAndRoles")}
          />
        </FormGroup>
        <FormGroup
          label={t("includeClients")}
          fieldId="include-clients-check"
          hasNoPaddingTop
        >
          <Switch
            id="include-clients-check"
            data-testid="include-clients-check"
            onChange={(_event, val) => setExportClients(val)}
            isChecked={exportClients}
            label={t("on")}
            labelOff={t("off")}
            aria-label={t("includeClients")}
          />
        </FormGroup>
      </Form>

      {showWarning && (
        <Alert
          data-testid="warning-message"
          variant="warning"
          component="p"
          title={t("exportWarningTitle")}
          isInline
        >
          {t("exportWarningDescription")}
        </Alert>
      )}
    </Modal>
  );
};
