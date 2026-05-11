/* eslint-disable */
// @ts-nocheck

import {
  SelectControl,
  TextControl,
  useEnvironment,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { Fragment, useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { updatePermissions } from "../../api";
import type { Permission, Resource } from "../../api/representations";
import { useAccountAlerts } from "../../utils/useAccountAlerts";


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

type EditTheResourceProps = {
  resource: Resource;
  permissions?: Permission[];
  onClose: () => void;
};

type FormValues = {
  permissions: Permission[];
};

export const EditTheResource = ({
  resource,
  permissions,
  onClose,
}: EditTheResourceProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const form = useForm<FormValues>();
  const { control, reset, handleSubmit } = form;

  const { fields } = useFieldArray<FormValues>({
    control,
    name: "permissions",
  });

  useEffect(() => reset({ permissions }), []);

  const editShares = async ({ permissions }: FormValues) => {
    try {
      await Promise.all(
        permissions.map((permission) =>
          updatePermissions(context, resource._id, [permission]),
        ),
      );
      addAlert(t("updateSuccess"));
      onClose();
    } catch (error) {
      addError("updateError", error);
    }
  };

  return (
    <Modal
      title={t("editTheResource", { name: resource.name })}
      variant="medium"
      isOpen
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          variant="primary"
          id="done"
          type="submit"
          form="edit-form"
        >
          {t("done")}
        </Button>,
      ]}
    >
      <Form id="edit-form" onSubmit={handleSubmit(editShares)}>
        <FormProvider {...form}>
          {fields.map((p, index) => (
            <Fragment key={p.id}>
              <TextControl
                name={`permissions.${index}.username`}
                label={t("user")}
                isDisabled
              />
              <SelectControl
                id={`permissions-${p.id}`}
                name={`permissions.${index}.scopes`}
                label="permissions"
                variant="typeaheadMulti"
                controller={{ defaultValue: [] }}
                options={resource.scopes.map(({ name, displayName }) => ({
                  key: name,
                  value: displayName || name,
                }))}
              />
            </Fragment>
          ))}
        </FormProvider>
      </Form>
    </Modal>
  );
};
