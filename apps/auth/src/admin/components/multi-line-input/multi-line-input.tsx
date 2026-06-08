/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/multi-line-input/MultiLineInput.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { MinusCircle as MinusCircleIcon, PlusCircle as PlusCircleIcon } from "@phosphor-icons/react"
import { Fragment, useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormErrorText } from "../../../shared/keycloak-ui-shared";


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
const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);
type TextInputProps = React.ComponentProps<typeof TextInput>;

function stringToMultiline(value?: string): string[] {
  return typeof value === "string" ? value.split("##") : [value || ""];
}

function toStringValue(formValue: string[]): string {
  return formValue.join("##");
}

export type MultiLineInputProps = Omit<TextInputProps, "form"> & {
  name: string;
  addButtonLabel?: string;
  isDisabled?: boolean;
  defaultValue?: string[];
  stringify?: boolean;
  isRequired?: boolean;
};

export const MultiLineInput = ({
  name,
  addButtonLabel,
  isDisabled = false,
  defaultValue,
  stringify = false,
  isRequired = false,
  id,
  ...rest
}: MultiLineInputProps) => {
  const { t } = useTranslation();
  const {
    register,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();
  const value = useWatch({
    name,
    control,
    defaultValue: defaultValue || "",
  });

  const fields = useMemo<string[]>(() => {
    let values = stringify
      ? stringToMultiline(
          Array.isArray(value) && value.length === 1 ? value[0] : value,
        )
      : Array.isArray(value)
        ? value
        : [value];

    if (!Array.isArray(values) || values.length === 0) {
      values = (stringify
        ? stringToMultiline(defaultValue as string)
        : defaultValue) || [""];
    }

    return values;
  }, [value]);

  const remove = (index: number) => {
    update([...fields.slice(0, index), ...fields.slice(index + 1)]);
  };

  const append = () => {
    update([...fields, ""]);
  };

  const updateValue = (index: number, value: string) => {
    update([...fields.slice(0, index), value, ...fields.slice(index + 1)]);
  };

  const update = (values: string[]) => {
    const fieldValue = values.flatMap((field) => field);
    setValue(name, stringify ? toStringValue(fieldValue) : fieldValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  if (typeof getValues(name) === "undefined") {
    update(fields); // set initial default values
  }

  useEffect(() => {
    register(name, {
      validate: (value) =>
        isRequired &&
        (stringify ? value : toStringValue(value || [])).length === 0
          ? t("required")
          : undefined,
    });
  }, [register]);

  const getError = () => {
    return name.split(".").reduce((record: any, key) => record?.[key], errors);
  };

  return (
    <div id={id} className="space-y-2">
      {fields.map((value, index) => (
        <Fragment key={index}>
          <InputGroup>
            <InputGroupItem isFill>
              <TextInput
                data-testid={name + index}
                onChange={(_event, value) => updateValue(index, value)}
                name={`${name}.${index}.value`}
                value={value}
                isDisabled={isDisabled}
                {...rest}
              />
            </InputGroupItem>
            <InputGroupItem>
              <Button
                data-testid={"remove" + index}
                variant={ButtonVariant.link}
                onClick={() => remove(index)}
                tabIndex={-1}
                aria-label={t("remove")}
                isDisabled={fields.length === 1 || isDisabled}
              >
                <MinusCircleIcon />
              </Button>
            </InputGroupItem>
          </InputGroup>
          {index === fields.length - 1 && (
            <>
              {getError() && <FormErrorText message={t("required")} />}
              <Button
                variant={ButtonVariant.link}
                onClick={append}
                tabIndex={-1}
                aria-label={t("add")}
                data-testid={`${name}-addValue`}
                isDisabled={!value || isDisabled}
              >
                <PlusCircleIcon /> {t(addButtonLabel || "add")}
              </Button>
            </>
          )}
        </Fragment>
      ))}
    </div>
  );
};
