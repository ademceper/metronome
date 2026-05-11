/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/MultiInputComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { MinusCircle as MinusCircleIcon, PlusCircle as PlusCircleIcon } from "@phosphor-icons/react"
import { type TFunction } from "i18next";
import { Fragment, useEffect, useMemo } from "react";
import { FieldPath, UseFormReturn, useWatch } from "react-hook-form";

import { InputType, UserProfileFieldProps } from "./UserProfileFields";
import { UserProfileGroup } from "./UserProfileGroup";
import { UserFormFields, fieldName, labelAttribute } from "./utils";


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
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);
const TextInputTypes = {
  text: "text", password: "password", email: "email", number: "number",
  search: "search", url: "url", tel: "tel", date: "date", time: "time",
} as const;
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
);
type TextInputProps = React.ComponentProps<typeof TextInput>;

export const MultiInputComponent = ({
  t,
  form,
  attribute,
  renderer,
  ...rest
}: UserProfileFieldProps) => (
  <UserProfileGroup t={t} form={form} attribute={attribute} renderer={renderer}>
    <MultiLineInput
      t={t}
      form={form}
      aria-label={labelAttribute(t, attribute)}
      name={fieldName(attribute.name)!}
      defaultValue={[attribute.defaultValue || ""]}
      addButtonLabel={t("addMultivaluedLabel", {
        fieldLabel: labelAttribute(t, attribute),
      })}
      {...rest}
    />
  </UserProfileGroup>
);

export type MultiLineInputProps = Omit<TextInputProps, "form"> & {
  t: TFunction;
  name: FieldPath<UserFormFields>;
  form: UseFormReturn<UserFormFields>;
  addButtonLabel?: string;
  isDisabled?: boolean;
  defaultValue?: string[];
  inputType: InputType;
};

const MultiLineInput = ({
  t,
  name,
  inputType,
  form,
  addButtonLabel,
  isDisabled = false,
  defaultValue,
  id,
  ...rest
}: MultiLineInputProps) => {
  const { register, setValue, control } = form;
  const value = useWatch({
    name,
    control,
    defaultValue: defaultValue || "",
  });

  const fields = useMemo<string[]>(() => {
    return Array.isArray(value) && value.length !== 0
      ? value
      : defaultValue || [""];
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
    setValue(name, fieldValue, {
      shouldDirty: true,
    });
  };

  const type = inputType.startsWith("html")
    ? (inputType.substring("html".length + 2) as TextInputTypes)
    : "text";

  useEffect(() => {
    register(name);
  }, [register]);

  return (
    <div id={id}>
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
                type={type}
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
            <Button
              variant={ButtonVariant.link}
              onClick={append}
              tabIndex={-1}
              aria-label={t("add")}
              data-testid="addValue"
              isDisabled={!value || isDisabled}
            >
              <PlusCircleIcon /> {t(addButtonLabel || "add")}
            </Button>
          )}
        </Fragment>
      ))}
    </div>
  );
};
