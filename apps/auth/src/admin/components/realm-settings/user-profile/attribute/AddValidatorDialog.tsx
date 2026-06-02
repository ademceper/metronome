/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/user-profile/attribute/AddValidatorDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import ComponentTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentTypeRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { DynamicComponents } from "../../../dynamic/DynamicComponents";
import { useServerInfo } from "../../../../context/server-info/server-info-provider";
import type { IndexedValidations } from "../../NewAttributeSettings";
import { ValidatorSelect } from "./ValidatorSelect";


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

export type AddValidatorDialogProps = {
  selectedValidators: IndexedValidations[];
  toggleDialog: () => void;
  onConfirm: (newValidator: ComponentRepresentation) => void;
};

export const AddValidatorDialog = ({
  selectedValidators,
  toggleDialog,
  onConfirm,
}: AddValidatorDialogProps) => {
  const { t } = useTranslation();
  const [selectedValidator, setSelectedValidator] =
    useState<ComponentTypeRepresentation>();

  const allSelected =
    useServerInfo().componentTypes?.["org.keycloak.validate.Validator"]
      .length === selectedValidators.length;
  const form = useForm<ComponentTypeRepresentation>();
  const { handleSubmit } = form;

  const save = (newValidator: ComponentTypeRepresentation) => {
    onConfirm({ ...newValidator, id: selectedValidator?.id });
    toggleDialog();
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("addValidator")}
      isOpen
      onClose={toggleDialog}
      actions={[
        <Button
          key="save"
          data-testid="save-validator-role-button"
          variant="primary"
          type="submit"
          form="add-validator"
        >
          {t("save")}
        </Button>,
        <Button
          key="cancel"
          data-testid="cancel-validator-role-button"
          variant="link"
          onClick={toggleDialog}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      {allSelected ? (
        t("emptyValidators")
      ) : (
        <Form id="add-validator" onSubmit={handleSubmit(save)}>
          <ValidatorSelect
            selectedValidators={selectedValidators.map(
              (validator) => validator.key,
            )}
            onChange={setSelectedValidator}
          />
          {selectedValidator && (
            <FormProvider {...form}>
              <DynamicComponents properties={selectedValidator.properties} />
            </FormProvider>
          )}
        </Form>
      )}
    </Modal>
  );
};
