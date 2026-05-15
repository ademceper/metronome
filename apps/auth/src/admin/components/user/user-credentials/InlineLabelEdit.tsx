/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/user-credentials/InlineLabelEdit.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type CredentialRepresentation from "@keycloak/keycloak-admin-client/lib/defs/credentialRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { Check as CheckIcon, PencilSimple as PencilAltIcon, X as TimesIcon } from "@phosphor-icons/react"
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";


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
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

type UserLabelForm = {
  userLabel: string;
};

type InlineLabelEditProps = {
  userId: string;
  credential: CredentialRepresentation;
  isEditable: boolean;
  toggle: () => void;
};

export const InlineLabelEdit = ({
  userId,
  credential,
  isEditable,
  toggle,
}: InlineLabelEditProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<UserLabelForm>();

  const { addAlert, addError } = useAlerts();

  const saveUserLabel = async (userLabel: UserLabelForm) => {
    try {
      await adminClient.users.updateCredentialLabel(
        {
          id: userId,
          credentialId: credential.id!,
        },
        userLabel.userLabel || "",
      );
      addAlert(t("updateCredentialUserLabelSuccess"), AlertVariant.success);
      toggle();
    } catch (error) {
      addError("updateCredentialUserLabelError", error);
    }
  };

  return (
    <Form
      isHorizontal
      className="kc-form-userLabel"
      onSubmit={handleSubmit(saveUserLabel)}
    >
      <FormGroup fieldId="kc-userLabel" className="kc-userLabel-row">
        <div className="kc-form-group-userLabel">
          {isEditable ? (
            <>
              <TextInput
                data-testid="userLabelFld"
                defaultValue={credential.userLabel}
                className="kc-userLabel"
                aria-label={t("userLabel")}
                {...register("userLabel")}
              />
              <div className="kc-userLabel-actionBtns">
                <Button
                  data-testid="editUserLabelAcceptBtn"
                  variant="link"
                  className="kc-editUserLabelAcceptBtn"
                  aria-label={t("acceptBtn")}
                  type="submit"
                  icon={<CheckIcon />}
                />
                <Button
                  data-testid="editUserLabelCancelBtn"
                  variant="link"
                  className="kc-editUserLabel-cancelBtn"
                  aria-label={t("cancelBtn")}
                  onClick={toggle}
                  icon={<TimesIcon />}
                />
              </div>
            </>
          ) : (
            <>
              {credential.userLabel}
              <Button
                aria-label={t("editUserLabel")}
                variant="link"
                className="kc-editUserLabel-btn"
                onClick={toggle}
                data-testid="editUserLabelBtn"
                icon={<PencilAltIcon />}
              />
            </>
          )}
        </div>
      </FormGroup>
    </Form>
  );
};
