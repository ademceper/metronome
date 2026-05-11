/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/keys/ExportSamlKeyDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import KeyStoreConfig from "@keycloak/keycloak-admin-client/lib/defs/keystoreConfig";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { saveAs } from "file-saver";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { useRealm } from "../../context/realm-context/RealmContext";
import { KeyForm, getFileExtension } from "./GenerateKeyDialog";
import { KeyTypes } from "./SamlKeys";


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

type ExportSamlKeyDialogProps = {
  clientId: string;
  close: () => void;
  keyType: KeyTypes;
};

export const ExportSamlKeyDialog = ({
  clientId,
  close,
  keyType,
}: ExportSamlKeyDialogProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { realm } = useRealm();

  const { addAlert, addError } = useAlerts();

  const form = useForm<KeyStoreConfig>({
    defaultValues: { realmAlias: realm },
  });

  const download = async (config: KeyStoreConfig) => {
    try {
      const keyStore = await adminClient.clients.downloadKey(
        {
          id: clientId,
          attr: keyType,
        },
        config,
      );
      saveAs(
        new Blob([keyStore], { type: "application/octet-stream" }),
        `keystore.${getFileExtension(config.format ?? "")}`,
      );
      addAlert(t("samlKeysExportSuccess"));
      close();
    } catch (error) {
      addError("samlKeysExportError", error);
    }
  };

  return (
    <Modal
      variant="medium"
      title={t("exportSamlKeyTitle")}
      isOpen
      onClose={close}
      actions={[
        <Button
          id="modal-confirm"
          data-testid="confirm"
          key="confirm"
          type="submit"
          form="export-saml-key-form"
        >
          {t("export")}
        </Button>,
        <Button
          id="modal-cancel"
          data-testid="cancel"
          key="cancel"
          variant="link"
          onClick={() => {
            close();
          }}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <Form
        id="export-saml-key-form"
        className="pf-v5-u-pt-lg"
        onSubmit={form.handleSubmit(download)}
      >
        <FormProvider {...form}>
          <KeyForm isSaml />
        </FormProvider>
      </Form>
    </Modal>
  );
};
