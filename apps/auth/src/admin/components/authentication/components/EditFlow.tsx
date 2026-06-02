/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/components/EditFlow.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { PencilSimple as PencilAltIcon } from "@phosphor-icons/react"
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  TextAreaControl,
  TextControl,
} from "../../../../shared/keycloak-ui-shared";
import useToggle from "../../../utils/use-toggle";
import type { ExpandableExecution } from "../execution-model";


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
const Tooltip = ({ content, children, ...props }: any) => <>{children}</>;

type EditFlowProps = {
  execution: ExpandableExecution;
  onRowChange: (execution: ExpandableExecution) => void;
};

type FormFields = Omit<ExpandableExecution, "executionList">;

export const EditFlow = ({ execution, onRowChange }: EditFlowProps) => {
  const { t } = useTranslation();
  const form = useForm<FormFields>({
    mode: "onChange",
    defaultValues: execution,
  });
  const [show, toggle] = useToggle();

  useEffect(() => form.reset(execution), [execution]);

  const onSubmit = (formValues: FormFields) => {
    onRowChange({ ...execution, ...formValues });
    toggle();
  };

  return (
    <>
      <Tooltip content={t("edit")}>
        <Button
          variant="plain"
          data-testid={`${execution.id}-edit`}
          aria-label={t("edit")}
          onClick={toggle}
        >
          <PencilAltIcon />
        </Button>
      </Tooltip>
      {show && (
        <Modal
          title={t("editFlow")}
          onClose={toggle}
          variant={ModalVariant.small}
          actions={[
            <Button
              key="confirm"
              data-testid="confirm"
              type="submit"
              form="edit-flow-form"
              isDisabled={!form.formState.isValid}
            >
              {t("edit")}
            </Button>,
            <Button
              data-testid="cancel"
              key="cancel"
              variant={ButtonVariant.link}
              onClick={toggle}
            >
              {t("cancel")}
            </Button>,
          ]}
          isOpen
        >
          <Form
            id="edit-flow-form"
            onSubmit={form.handleSubmit(onSubmit)}
            isHorizontal
          >
            <FormProvider {...form}>
              <TextControl
                name="displayName"
                label={t("name")}
                labelIcon={t("flowNameHelp")}
                rules={{ required: t("required") }}
              />
              <TextAreaControl
                name="description"
                label={t("description")}
                labelIcon={t("flowDescriptionHelp")}
                rules={{
                  maxLength: {
                    value: 255,
                    message: t("maxLength", { length: 255 }),
                  },
                }}
              />
            </FormProvider>
          </Form>
        </Modal>
      )}
    </>
  );
};
