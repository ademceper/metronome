/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/UserIdPModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type FederatedIdentityRepresentation from "@keycloak/keycloak-admin-client/lib/defs/federatedIdentityRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { capitalize } from "lodash-es";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextControl } from "../../shared/keycloak-ui-shared";
import { useAdminClient } from "../admin-client";
import { useAlerts } from "../../shared/keycloak-ui-shared";


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
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

type UserIdpModalProps = {
  userId: string;
  federatedId: string;
  onClose: () => void;
  onRefresh: () => void;
};

export const UserIdpModal = ({
  userId,
  federatedId,
  onClose,
  onRefresh,
}: UserIdpModalProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const form = useForm<FederatedIdentityRepresentation>({
    mode: "onChange",
  });
  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = async (
    federatedIdentity: FederatedIdentityRepresentation,
  ) => {
    try {
      await adminClient.users.addToFederatedIdentity({
        id: userId,
        federatedIdentityId: federatedId,
        federatedIdentity,
      });
      addAlert(t("idpLinkSuccess"), AlertVariant.success);
      onClose();
      onRefresh();
    } catch (error) {
      addError("couldNotLinkIdP", error);
    }
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("linkAccountTitle", {
        provider: capitalize(federatedId),
      })}
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          data-testid="confirm"
          variant="primary"
          type="submit"
          form="group-form"
          isDisabled={!isValid}
        >
          {t("link")}
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
      isOpen
    >
      <Form id="group-form" onSubmit={handleSubmit(onSubmit)}>
        <FormProvider {...form}>
          <FormGroup label={t("identityProvider")} fieldId="identityProvider">
            <TextInput
              id="identityProvider"
              data-testid="idpNameInput"
              value={capitalize(federatedId)}
              readOnly
            />
          </FormGroup>
          <TextControl
            name="userId"
            label={t("userID")}
            helperText={t("userIdHelperText")}
            autoFocus
            rules={{
              required: t("required"),
            }}
          />
          <TextControl
            name="userName"
            label={t("username")}
            helperText={t("usernameHelperText")}
            rules={{
              required: t("required"),
            }}
          />
        </FormProvider>
      </Form>
    </Modal>
  );
};
