/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/keys/ImportKeyDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import {
  SelectControl,
  FileUploadControl,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useServerInfo } from "../../context/server-info/ServerInfoProvider";
import { StoreSettings } from "./StoreSettings";


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
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);

type ImportKeyDialogProps = {
  toggleDialog: () => void;
  save: (importFile: ImportFile) => void;
  title?: string;
  description?: string;
};

export type ImportFile = {
  keystoreFormat: string;
  keyAlias: string;
  storePassword: string;
  file: File | string;
};

export const ImportKeyDialog = ({
  save,
  toggleDialog,
  title = "generateKeys",
  description = "generateKeysDescription",
}: ImportKeyDialogProps) => {
  const { t } = useTranslation();
  const form = useForm<ImportFile>();
  const { control, handleSubmit } = form;

  const baseFormats = useServerInfo().cryptoInfo?.supportedKeystoreTypes ?? [];

  const formats = baseFormats.concat([
    "Certificate PEM",
    "Public Key PEM",
    "JSON Web Key Set",
  ]);

  const format = useWatch({
    control,
    name: "keystoreFormat",
    defaultValue: formats[0],
  });

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t(title)}
      isOpen
      onClose={toggleDialog}
      actions={[
        <Button
          id="modal-confirm"
          data-testid="confirm"
          key="confirm"
          onClick={async () => {
            await handleSubmit((importFile) => {
              save(importFile);
              toggleDialog();
            })();
          }}
        >
          {t("import")}
        </Button>,
        <Button
          id="modal-cancel"
          data-testid="cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={toggleDialog}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <TextContent>
        <Text>{t(description)}</Text>
      </TextContent>
      <Form className="pf-v5-u-pt-lg">
        <FormProvider {...form}>
          <SelectControl
            name="keystoreFormat"
            label={t("archiveFormat")}
            labelIcon={t("archiveFormatHelp")}
            controller={{
              defaultValue: formats[0],
            }}
            options={formats}
          />
          <FileUploadControl
            label={t("importFile")}
            id="importFile"
            name="file"
            rules={{
              required: t("required"),
            }}
          />
          {baseFormats.includes(format) && <StoreSettings hidePassword />}
        </FormProvider>
      </Form>
    </Modal>
  );
};
