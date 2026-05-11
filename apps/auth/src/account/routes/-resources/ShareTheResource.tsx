/* eslint-disable */
// @ts-nocheck

import {
  FormErrorText,
  SelectControl,
  useEnvironment,
} from "../../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { useEffect } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { updateRequest } from "../../lib/api/resources";
import { Permission, Resource } from "../../lib/api/representations";
import { useAccountAlerts } from "../../lib/useAccountAlerts";
import { SharedWith } from "./SharedWith";


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
const Chip = ({ onClick, children, ...props }: any) => (
  <UIBadge variant="secondary" {...props}>
    {children}
    {onClick ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </UIBadge>
);
const ChipGroup = ({ categoryName, numChips, onClick, isClosable, children, ...props }: any) => (
  <div className="flex flex-wrap items-center gap-1" {...props}>
    {categoryName ? <span className="text-muted-foreground text-xs">{categoryName}:</span> : null}
    {children}
    {isClosable ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </div>
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
const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
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
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);
const ValidatedOptions = {
  default: "default",
  success: "success",
  warning: "warning",
  error: "error",
} as const;

type ShareTheResourceProps = {
  resource: Resource;
  permissions?: Permission[];
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  permissions: string[];
  usernames: { value: string }[];
};

export const ShareTheResource = ({
  resource,
  permissions,
  open,
  onClose,
}: ShareTheResourceProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();
  const form = useForm<FormValues>();
  const {
    control,
    register,
    reset,
    formState: { errors, isValid },
    setError,
    clearErrors,
    handleSubmit,
  } = form;
  const { fields, append, remove } = useFieldArray<FormValues>({
    control,
    name: "usernames",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ value: "" });
    }
  }, [fields]);

  const watchFields = useWatch({
    control,
    name: "usernames",
    defaultValue: [],
  });

  const isDisabled = watchFields.every(
    ({ value }) => value.trim().length === 0,
  );

  const addShare = async ({ usernames, permissions }: FormValues) => {
    try {
      await Promise.all(
        usernames
          .filter(({ value }) => value !== "")
          .map(({ value: username }) =>
            updateRequest(context, resource._id, username, permissions),
          ),
      );
      addAlert(t("shareSuccess"));
      onClose();
    } catch (error) {
      addError("shareError", error);
    }
    reset({});
  };

  const validateUser = async () => {
    const userOrEmails = fields.map((f) => f.value).filter((f) => f !== "");
    const userPermission = permissions
      ?.map((p) => [p.username, p.email])
      .flat();

    const hasUsers = userOrEmails.length > 0;
    const alreadyShared =
      userOrEmails.filter((u) => userPermission?.includes(u)).length !== 0;

    if (!hasUsers || alreadyShared) {
      setError("usernames", {
        message: !hasUsers ? t("required") : t("resourceAlreadyShared"),
      });
    } else {
      clearErrors();
    }

    return hasUsers && !alreadyShared;
  };

  return (
    <Modal
      title={t("shareTheResource", { name: resource.name })}
      variant="medium"
      isOpen={open}
      onClose={onClose}
      actions={[
        <Button
          key="confirm"
          variant="primary"
          data-testid="done"
          isDisabled={!isValid}
          type="submit"
          form="share-form"
        >
          {t("done")}
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          {t("cancel")}
        </Button>,
      ]}
    >
      <Form id="share-form" onSubmit={handleSubmit(addShare)}>
        <FormGroup
          label={t("shareUser")}
          type="string"
          fieldId="users"
          isRequired
        >
          <InputGroup>
            <InputGroupItem>
              <TextInput
                id="users"
                data-testid="users"
                placeholder={t("usernamePlaceholder")}
                validated={
                  errors.usernames
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
                {...register(`usernames.${fields.length - 1}.value`, {
                  validate: validateUser,
                })}
              />
            </InputGroupItem>
            <InputGroupItem>
              <Button
                key="add-user"
                variant="primary"
                data-testid="add"
                onClick={() => append({ value: "" })}
                isDisabled={isDisabled}
              >
                {t("add")}
              </Button>
            </InputGroupItem>
          </InputGroup>
          {fields.length > 1 && (
            <ChipGroup categoryName={t("shareWith") + " "}>
              {fields.map(
                (field, index) =>
                  index !== fields.length - 1 && (
                    <Chip key={field.id} onClick={() => remove(index)}>
                      {field.value}
                    </Chip>
                  ),
              )}
            </ChipGroup>
          )}
          {errors.usernames && (
            <FormErrorText message={errors.usernames.message!} />
          )}
        </FormGroup>
        <FormProvider {...form}>
          <FormGroup
            label=""
            fieldId="permissions-selected"
            data-testid="permissions"
          >
            <SelectControl
              name="permissions"
              variant="typeaheadMulti"
              controller={{ defaultValue: [] }}
              options={resource.scopes.map(({ name, displayName }) => ({
                key: name,
                value: displayName || name,
              }))}
            />
          </FormGroup>
        </FormProvider>
        <FormGroup>
          <SharedWith permissions={permissions} />
        </FormGroup>
      </Form>
    </Modal>
  );
};
