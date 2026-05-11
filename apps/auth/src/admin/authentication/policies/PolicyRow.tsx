/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/policies/PolicyRow.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type PasswordPolicyTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/passwordPolicyTypeRepresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { MinusCircle as MinusCircleIcon } from "@phosphor-icons/react"
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormErrorText, HelpItem } from "../../../shared/keycloak-ui-shared";

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
const NumberInput = ({ value, onChange, min, max, step, ...props }: any) => (
  <UIInput type="number" value={value ?? ""}
    onChange={(e: any) => onChange?.(e)} min={min} max={max} step={step} {...props} />
);
const Split = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-row gap-2", className)} {...props}>{children}</div>
);
const SplitItem = ({ isFilled, children, className, ...props }: any) => (
  <div className={cn(isFilled && "flex-1", className)} {...props}>{children}</div>
);
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
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

type PolicyRowProps = {
  policy: PasswordPolicyTypeRepresentation;
  onRemove: (id?: string) => void;
};

export const PolicyRow = ({
  policy: { id, configType, defaultValue, displayName },
  onRemove,
}: PolicyRowProps) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[id!];

  return (
    <FormGroup
      label={displayName}
      fieldId={id!}
      isRequired
      labelIcon={
        <HelpItem
          helpText={t(`passwordPoliciesHelp.${id}`)}
          fieldLabelId={id!}
        />
      }
    >
      <Split>
        <SplitItem isFilled>
          {configType && configType !== "int" && (
            <TextInput
              id={id}
              data-testid={id}
              {...register(id!, { required: true })}
              defaultValue={defaultValue}
              validated={
                error ? ValidatedOptions.error : ValidatedOptions.default
              }
            />
          )}
          {configType === "int" && (
            <Controller
              name={id!}
              defaultValue={Number.parseInt(defaultValue || "0")}
              control={control}
              render={({ field }) => {
                const MIN_VALUE = 0;
                const setValue = (newValue: number) =>
                  field.onChange(Math.max(newValue, MIN_VALUE));
                const value = Number(field.value);

                return (
                  <NumberInput
                    id={id}
                    value={value}
                    min={MIN_VALUE}
                    onPlus={() => setValue(value + 1)}
                    onMinus={() => setValue(value - 1)}
                    onChange={(event) => {
                      const newValue = Number(event.currentTarget.value);
                      setValue(!isNaN(newValue) ? newValue : 0);
                    }}
                    className="keycloak__policies_authentication__number-field"
                  />
                );
              }}
            />
          )}
          {!configType && (
            <Switch
              id={id!}
              label={t("on")}
              labelOff={t("off")}
              isChecked
              isDisabled
              aria-label={displayName}
            />
          )}
        </SplitItem>
        <SplitItem>
          <Button
            data-testid={`remove-${id}`}
            variant="link"
            className="keycloak__policies_authentication__minus-icon"
            onClick={() => onRemove(id)}
            aria-label={t("remove")}
          >
            <MinusCircleIcon />
          </Button>
        </SplitItem>
      </Split>
      {error && <FormErrorText message={t("required")} />}
    </FormGroup>
  );
};
