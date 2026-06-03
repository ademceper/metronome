/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/AddTranslationModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextControl } from "../../../shared/keycloak-ui-shared";
import type { KeyValueType } from "../key-value-form/key-value-convert";


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

type AddTranslationModalProps = {
  id?: string;
  form: UseFormReturn<TranslationForm>;
  save: SubmitHandler<TranslationForm>;
  handleModalToggle: () => void;
};

export type TranslationForm = {
  key: string;
  value: string;
  translation: KeyValueType;
};

export const AddTranslationModal = ({
  handleModalToggle,
  save,
  form,
}: AddTranslationModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("addTranslation")}
      isOpen
      onClose={handleModalToggle}
      actions={[
        <Button
          data-testid="add-translation-confirm-button"
          key="confirm"
          variant="primary"
          type="submit"
          form="translation-form"
        >
          {t("create")}
        </Button>,
        <Button
          id="modal-cancel"
          data-testid="cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={() => {
            handleModalToggle();
          }}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <Form
        id="translation-form"
        isHorizontal
        onSubmit={form.handleSubmit(save)}
      >
        <FormProvider {...form}>
          <TextControl
            name="key"
            label={t("key")}
            autoFocus
            rules={{
              required: t("required"),
            }}
          />
          <TextControl
            name="value"
            label={t("value")}
            rules={{
              required: t("required"),
            }}
          />
        </FormProvider>
      </Form>
    </Modal>
  );
};
