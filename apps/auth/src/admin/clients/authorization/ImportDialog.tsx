/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/ImportDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import type ResourceServerRepresentation from "@keycloak/keycloak-admin-client/lib/defs/resourceServerRepresentation";
import { JsonFileUpload } from "../../components/json-file-upload/JsonFileUpload";
import { HelpItem } from "../../../shared/keycloak-ui-shared";


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
const Divider = (props: any) => <UISeparator {...props} />;
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
const Radio = ({ id, name, label, description, isChecked, onChange, isDisabled, value, ...props }: any) => (
  <div className="flex items-start gap-2">
    <input type="radio" id={id} name={name} value={value} checked={!!isChecked} disabled={isDisabled}
      onChange={(e) => onChange?.(e, e.target.checked)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
);
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

type ImportDialogProps = {
  onConfirm: (value: ResourceServerRepresentation) => void;
  closeDialog: () => void;
};

export const ImportDialog = ({ onConfirm, closeDialog }: ImportDialogProps) => {
  const { t } = useTranslation();
  const [imported, setImported] = useState<ResourceServerRepresentation>({});
  return (
    <Modal
      title={t("import")}
      isOpen
      variant="small"
      onClose={closeDialog}
      actions={[
        <Button
          id="modal-confirm"
          key="confirm"
          onClick={() => {
            onConfirm(imported);
            closeDialog();
          }}
          data-testid="confirm"
        >
          {t("confirm")}
        </Button>,
        <Button
          data-testid="cancel"
          id="modal-cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={() => {
            closeDialog();
          }}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <Form>
        <JsonFileUpload id="import-resource" onChange={setImported} />
      </Form>
      {Object.keys(imported).length !== 0 && (
        <>
          <Divider />
          <p className="pf-v5-u-my-lg">{t("importResources")}</p>
          <Form isHorizontal>
            <FormGroup
              label={t("policyEnforcementMode")}
              labelIcon={
                <HelpItem
                  helpText={t("policyEnforcementModeHelp")}
                  fieldLabelId="policyEnforcementMode"
                />
              }
              fieldId="policyEnforcementMode"
              hasNoPaddingTop
            >
              <Radio
                id="policyEnforcementMode"
                name="policyEnforcementMode"
                label={t(
                  `policyEnforcementModes.${imported.policyEnforcementMode}`,
                )}
                isChecked
                isDisabled
                className="pf-v5-u-mb-md"
              />
            </FormGroup>
            <FormGroup
              label={t("decisionStrategy")}
              labelIcon={
                <HelpItem
                  helpText={t("decisionStrategyHelp")}
                  fieldLabelId="decisionStrategy"
                />
              }
              fieldId="decisionStrategy"
              hasNoPaddingTop
            >
              <Radio
                id="decisionStrategy"
                name="decisionStrategy"
                isChecked
                isDisabled
                label={t(`decisionStrategies.${imported.decisionStrategy}`)}
                className="pf-v5-u-mb-md"
              />
            </FormGroup>
            <FormGroup
              hasNoPaddingTop
              label={t("allowRemoteResourceManagement")}
              fieldId="allowRemoteResourceManagement"
              labelIcon={
                <HelpItem
                  helpText={t("allowRemoteResourceManagement")}
                  fieldLabelId="allowRemoteResourceManagement"
                />
              }
            >
              <Switch
                id="allowRemoteResourceManagement"
                label={t("on")}
                labelOff={t("off")}
                isChecked={imported.allowRemoteResourceManagement}
                isDisabled
                aria-label={t("allowRemoteResourceManagement")}
              />
            </FormGroup>
          </Form>
          <div className="pf-v5-u-mt-md">
            {Object.entries(imported)
              .filter(([, value]) => Array.isArray(value))
              .map(([key, value]) => (
                <Fragment key={key}>
                  <Divider />
                  <p className="pf-v5-u-my-sm">
                    <strong>
                      {value.length} {t(key)}
                    </strong>
                  </p>
                </Fragment>
              ))}
          </div>
          <Divider />
          <Alert
            variant="warning"
            className="pf-v5-u-mt-lg"
            isInline
            title={t("importWarning")}
          />
        </>
      )}
    </Modal>
  );
};
