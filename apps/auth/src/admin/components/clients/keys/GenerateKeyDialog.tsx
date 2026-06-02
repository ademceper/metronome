/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/keys/GenerateKeyDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type KeyStoreConfig from "@keycloak/keycloak-admin-client/lib/defs/keystoreConfig";
import {
  HelpItem,
  NumberControl,
  SelectControl,
  FileUploadControl,
} from "../../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useServerInfo } from "../../../context/server-info/server-info-provider";
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

type GenerateKeyDialogProps = {
  clientId: string;
  toggleDialog: () => void;
  save: (keyStoreConfig: KeyStoreConfig) => void;
};

type KeyFormProps = {
  useFile?: boolean;
  isSaml?: boolean;
  hasPem?: boolean;
};

const CERT_PEM = "Certificate PEM" as const;

const extensions = new Map([
  ["PKCS12", "p12"],
  ["JKS", "jks"],
  ["BCFKS", "bcfks"],
]);

type FormFields = KeyStoreConfig & {
  file: string | File;
};

export const getFileExtension = (format: string) => extensions.get(format);

export const KeyForm = ({
  isSaml = false,
  hasPem = false,
  useFile = false,
}: KeyFormProps) => {
  const { t } = useTranslation();

  const { watch } = useFormContext<FormFields>();
  const format = watch("format");

  const { cryptoInfo } = useServerInfo();
  const supportedKeystoreTypes = [
    ...(cryptoInfo?.supportedKeystoreTypes ?? []),
    ...(hasPem ? [CERT_PEM] : []),
  ];
  const keySizes = ["4096", "3072", "2048"];

  return (
    <Form className="pf-v5-u-pt-lg">
      <SelectControl
        name="format"
        label={t("archiveFormat")}
        labelIcon={t("archiveFormatHelp")}
        controller={{
          defaultValue: supportedKeystoreTypes[0],
        }}
        menuAppendTo="parent"
        options={supportedKeystoreTypes}
      />
      {useFile && (
        <FileUploadControl
          label={t("importFile")}
          labelIcon={
            <HelpItem
              helpText={t("importFileHelp")}
              fieldLabelId="importFile"
            />
          }
          rules={{
            required: t("required"),
          }}
          name="file"
          id="importFile"
        />
      )}
      {format !== CERT_PEM && (
        <StoreSettings hidePassword={useFile} isSaml={isSaml} />
      )}
      {!useFile && (
        <>
          <SelectControl
            name="keySize"
            label={t("keySize")}
            labelIcon={t("keySizeHelp")}
            controller={{
              defaultValue: keySizes[0],
            }}
            menuAppendTo="parent"
            options={keySizes}
          />
          <NumberControl
            name="validity"
            label={t("validity")}
            labelIcon={t("validityHelp")}
            controller={{
              defaultValue: 3,
              rules: { required: t("required"), min: 1, max: 10 },
            }}
          />
        </>
      )}
    </Form>
  );
};

export const GenerateKeyDialog = ({
  clientId,
  save,
  toggleDialog,
}: GenerateKeyDialogProps) => {
  const { t } = useTranslation();
  const form = useForm<KeyStoreConfig>({
    defaultValues: { keyAlias: clientId },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t("generateKeys")}
      isOpen
      onClose={toggleDialog}
      actions={[
        <Button
          id="modal-confirm"
          key="confirm"
          data-testid="confirm"
          isDisabled={!isValid}
          onClick={async () => {
            await handleSubmit((config) => {
              save(config);
              toggleDialog();
            })();
          }}
        >
          {t("generate")}
        </Button>,
        <Button
          id="modal-cancel"
          key="cancel"
          data-testid="cancel"
          variant={ButtonVariant.link}
          onClick={() => {
            toggleDialog();
          }}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <TextContent>
        <Text>{t("generateKeysDescription")}</Text>
      </TextContent>
      <FormProvider {...form}>
        <KeyForm />
      </FormProvider>
    </Modal>
  );
};
