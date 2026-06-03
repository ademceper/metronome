/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/keys/SamlKeysDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import type CertificateRepresentation from "@keycloak/keycloak-admin-client/lib/defs/certificateRepresentation";
import type KeyStoreConfig from "@keycloak/keycloak-admin-client/lib/defs/keystoreConfig";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { saveAs } from "file-saver";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { Certificate } from "./certificate";
import { KeyForm } from "./generate-key-dialog";
import type { KeyTypes } from "./saml-keys";


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
const Flex = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const FlexItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
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
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TitleSizes = {
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;
const Title = ({ headingLevel = "h1", size, children, className, ...props }: any) =>
  React.createElement(headingLevel, {
    className: cn("font-heading font-medium", (TitleSizes as any)[size as string] ?? "text-base", className),
    ...props,
  }, children);

type SamlKeysDialogProps = {
  id: string;
  attr: KeyTypes;
  localeKey: string;
  onClose: () => void;
  onCancel: () => void;
};

export type SamlKeysDialogForm = KeyStoreConfig & {
  file: File;
};

export const submitForm = async (
  adminClient: KeycloakAdminClient,
  form: SamlKeysDialogForm,
  id: string,
  attr: KeyTypes,
  callback: (error?: unknown) => void,
) => {
  try {
    const formData = new FormData();
    const { file, ...rest } = form;
    Object.entries(rest).map(([key, value]) =>
      formData.append(
        key === "format" ? "keystoreFormat" : key,
        value.toString(),
      ),
    );
    formData.append("file", file);

    await adminClient.clients.uploadKey({ id, attr }, formData);
    callback();
  } catch (error) {
    callback(error);
  }
};

export const SamlKeysDialog = ({
  id,
  attr,
  localeKey,
  onClose,
  onCancel,
}: SamlKeysDialogProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const [type, setType] = useState(false);
  const [keys, setKeys] = useState<CertificateRepresentation>();
  const form = useForm<SamlKeysDialogForm>({ mode: "onChange" });
  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const { addAlert, addError } = useAlerts();

  const submit = async (form: SamlKeysDialogForm) => {
    await submitForm(adminClient, form, id, attr, (error) => {
      if (error) {
        addError("importError", error);
      } else {
        addAlert(t("importSuccess"), AlertVariant.success);
      }
    });
  };

  const generate = async () => {
    try {
      const key = await adminClient.clients.generateKey({
        id,
        attr,
      });
      setKeys(key);
      saveAs(
        new Blob([key.privateKey!], {
          type: "application/octet-stream",
        }),
        "private.key",
      );

      addAlert(t("generateSuccess"), AlertVariant.success);
    } catch (error) {
      addError("generateError", error);
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      aria-label={t("enableClientSignatureRequiredModal")}
      header={
        <TextContent>
          <Title headingLevel="h1">
            {t("enableClientSignatureRequired", {
              key: t(localeKey),
            })}
          </Title>
          <Text>
            {t("enableClientSignatureRequiredExplain", {
              key: t(localeKey),
            })}
          </Text>
        </TextContent>
      }
      isOpen={true}
      onClose={onClose}
      actions={[
        <Button
          id="modal-confirm"
          key="confirm"
          data-testid="confirm"
          variant="primary"
          isDisabled={!isValid && !keys}
          onClick={async () => {
            if (type) {
              await handleSubmit(submit)();
            }
            onClose();
          }}
        >
          {t("confirm")}
        </Button>,
        <Button
          id="modal-cancel"
          key="cancel"
          data-testid="cancel"
          variant={ButtonVariant.link}
          onClick={onCancel}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <FormProvider {...form}>
        <Form isHorizontal>
          <FormGroup
            label={t("selectMethod")}
            fieldId="selectMethod"
            hasNoPaddingTop
          >
            <Flex>
              <FlexItem>
                <Radio
                  isChecked={!type}
                  name="selectMethodType"
                  onChange={() => setType(false)}
                  label={t("selectMethodType.generate")}
                  id="selectMethodType-generate"
                />
              </FlexItem>
              <FlexItem>
                <Radio
                  isChecked={type}
                  name="selectMethodType"
                  onChange={() => setType(true)}
                  label={t("selectMethodType.import")}
                  id="selectMethodType-import"
                />
              </FlexItem>
            </Flex>
          </FormGroup>
          {!type && (
            <FormGroup
              label={t("certificate")}
              fieldId="certificate"
              labelIcon={
                <HelpItem
                  helpText={t(`saml${localeKey}CertificateHelp`)}
                  fieldLabelId="certificate"
                />
              }
            >
              <Split hasGutter>
                <SplitItem isFilled>
                  <Certificate plain keyInfo={keys} />
                </SplitItem>
                <SplitItem>
                  <Button
                    variant="secondary"
                    data-testid="generate"
                    onClick={generate}
                  >
                    {t("generate")}
                  </Button>
                </SplitItem>
              </Split>
            </FormGroup>
          )}
        </Form>
        {type && <KeyForm useFile hasPem />}
      </FormProvider>
    </Modal>
  );
};
