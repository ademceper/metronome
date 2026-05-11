/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/sessions/RevocationModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type GlobalRequestResult from "@keycloak/keycloak-admin-client/lib/defs/globalRequestResult";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../admin-client";
import { useAlerts } from "../../shared/keycloak-ui-shared";
import { useRealm } from "../context/realm-context/RealmContext";


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
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

type RevocationModalProps = {
  handleModalToggle: () => void;
  save: () => void;
};

export const RevocationModal = ({
  handleModalToggle,
  save,
}: RevocationModalProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const { realm: realmName, realmRepresentation: realm, refresh } = useRealm();
  const { register, handleSubmit } = useForm();

  const parseResult = (result: GlobalRequestResult, prefixKey: string) => {
    const successCount = result.successRequests?.length || 0;
    const failedCount = result.failedRequests?.length || 0;

    if (successCount === 0 && failedCount === 0) {
      addAlert(t("noAdminUrlSet"), AlertVariant.warning);
    } else if (failedCount > 0) {
      addAlert(
        t(prefixKey + "Success", {
          successNodes: result.successRequests,
        }),
        AlertVariant.success,
      );
      addAlert(
        t(prefixKey + "Fail", {
          failedNodes: result.failedRequests,
        }),
        AlertVariant.danger,
      );
    } else {
      addAlert(
        t(prefixKey + "Success", {
          successNodes: result.successRequests,
        }),
        AlertVariant.success,
      );
    }
  };

  const setToNow = async () => {
    try {
      await adminClient.realms.update(
        { realm: realmName },
        {
          realm: realmName,
          notBefore: Date.now() / 1000,
        },
      );

      addAlert(t("notBeforeSuccess"), AlertVariant.success);
    } catch (error) {
      addError("setToNowError", error);
    }
  };

  const clearNotBefore = async () => {
    try {
      await adminClient.realms.update(
        { realm: realmName },
        {
          realm: realmName,
          notBefore: 0,
        },
      );
      addAlert(t("notBeforeClearedSuccess"), AlertVariant.success);
      refresh();
    } catch (error) {
      addError("notBeforeError", error);
    }
  };

  const push = async () => {
    const result = await adminClient.realms.pushRevocation({
      realm: realmName,
    });
    parseResult(result, "notBeforePush");

    refresh();
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("revocation")}
      isOpen={true}
      onClose={handleModalToggle}
      actions={[
        <Button
          data-testid="set-to-now-button"
          key="set-to-now"
          variant="tertiary"
          onClick={async () => {
            await setToNow();
            handleModalToggle();
          }}
          form="revocation-modal-form"
        >
          {t("setToNow")}
        </Button>,
        <Button
          data-testid="clear-not-before-button"
          key="clear"
          variant="tertiary"
          onClick={async () => {
            await clearNotBefore();
            handleModalToggle();
          }}
          form="revocation-modal-form"
        >
          {t("clear")}
        </Button>,
        <Button
          data-testid="modal-test-connection-button"
          key="push"
          variant="secondary"
          onClick={async () => {
            await push();
            handleModalToggle();
          }}
          form="revocation-modal-form"
        >
          {t("push")}
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
      <TextContent className="kc-revocation-description-text">
        {t("revocationDescription")}
      </TextContent>
      <Form
        id="revocation-modal-form"
        isHorizontal
        onSubmit={handleSubmit(save)}
      >
        <FormGroup
          className="kc-revocation-modal-form-group"
          label={t("notBefore")}
          name="notBefore"
          fieldId="not-before"
        >
          <TextInput
            data-testid="not-before-input"
            autoFocus
            readOnly
            value={
              realm?.notBefore === 0
                ? (t("none") as string)
                : new Date(realm?.notBefore! * 1000).toString()
            }
            type="text"
            id="not-before"
            {...register("notBefore")}
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};
