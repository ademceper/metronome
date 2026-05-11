/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/MapComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import {
  HelpItem,
  KeycloakSelect,
  SelectVariant,
} from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { MinusCircle as MinusCircleIcon, PlusCircle as PlusCircleIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyValueType } from "../key-value-form/key-value-convert";
import type { ComponentProps } from "./components";
import { SelectOption } from "../../../shared/pf-compat"


const ActionList = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const ActionListItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
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
const EmptyState = ({ variant, titleText, headingLevel, icon, children, ...props }: any) => (
  <div className={cn("flex flex-col items-center gap-3 py-10 text-center", (props as any).className)} {...props}>
    {icon ? <div className="text-muted-foreground">{React.createElement(icon)}</div> : null}
    {titleText ? <h3 className="font-medium text-lg">{titleText}</h3> : null}
    {children}
  </div>
);
const EmptyStateBody = ({ children, className, ...props }: any) => (
  <div className={cn("text-muted-foreground text-sm", className)} {...props}>{children}</div>
);
const EmptyStateFooter = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col items-center gap-2", className)} {...props}>{children}</div>
);
const Flex = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>{children}</div>
);
const FlexItem = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
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

export const MapComponent = ({
  name,
  label,
  helpText,
  required,
  isDisabled,
  defaultValue,
  options,
  convertToName,
}: ComponentProps) => {
  const { t } = useTranslation();

  const { watch, setValue } = useFormContext();
  const [map, setMap] = useState<KeyValueType[]>([]);
  const fieldName = convertToName(name!);
  const value = watch(fieldName, defaultValue || "[]");
  useEffect(() => {
    const values: KeyValueType[] = JSON.parse(value ? value : "[]");
    setMap(values);
  }, [value]);

  const appendNew = () => setMap([...map, { key: "", value: "" }]);

  const update = (val = map) => {
    const v = val.filter((e) => e.key !== "");
    setValue(fieldName, v.length > 0 ? JSON.stringify(v) : "");
  };

  const updateKey = (index: number, key: string) => {
    return updateEntry(index, { ...map[index], key });
  };

  const updateValue = (index: number, value: string) => {
    return updateEntry(index, { ...map[index], value });
  };

  const updateEntry = (index: number, entry: KeyValueType) => {
    const newMap = [...map.slice(0, index), entry, ...map.slice(index + 1)];
    setMap(newMap);
    return newMap;
  };

  const remove = (index: number) => {
    const value = [...map.slice(0, index), ...map.slice(index + 1)];
    setMap(value);
    update(value);
  };

  const [open, setOpen] = useState(-1);

  return (
    <FormGroup
      label={t(label!)}
      labelIcon={<HelpItem helpText={t(helpText!)} fieldLabelId={`${label}`} />}
      fieldId={name!}
      isRequired={required}
    >
      {map.length !== 0 ? (
        <>
          <Flex direction={{ default: "column" }}>
            <Flex>
              <FlexItem
                grow={{ default: "grow" }}
                spacer={{ default: "spacerNone" }}
              >
                <strong>{t("key")}</strong>
              </FlexItem>
              <FlexItem grow={{ default: "grow" }}>
                <strong>{t("value")}</strong>
              </FlexItem>
            </Flex>
            {map.map((attribute, index) => (
              <Flex key={index} data-testid="row">
                <FlexItem grow={{ default: "grow" }}>
                  {options ? (
                    <KeycloakSelect
                      variant={SelectVariant.single}
                      onToggle={(v) => setOpen(v ? index : -1)}
                      selections={attribute.key}
                      data-testid={`${fieldName}.${index}.key`}
                      onSelect={(value) => {
                        update(updateKey(index, value.toString()));
                      }}
                      isOpen={open === index}
                      className={
                        attribute.key && !options.includes(attribute.key)
                          ? "pf-m-danger"
                          : ""
                      }
                    >
                      <SelectOption value="">{t("choose")}</SelectOption>
                      {options.map((option, index) => (
                        <SelectOption key={index} value={option}>
                          {option}
                        </SelectOption>
                      ))}
                    </KeycloakSelect>
                  ) : (
                    <TextInput
                      name={`${fieldName}.${index}.key`}
                      placeholder={t("keyPlaceholder")}
                      aria-label={t("key")}
                      value={attribute.key}
                      data-testid={`${fieldName}.${index}.key`}
                      onChange={(_event, value) => updateKey(index, value)}
                      onBlur={() => update()}
                    />
                  )}
                </FlexItem>
                <FlexItem
                  grow={{ default: "grow" }}
                  spacer={{ default: "spacerNone" }}
                >
                  <TextInput
                    name={`${fieldName}.${index}.value`}
                    placeholder={t("valuePlaceholder")}
                    aria-label={t("value")}
                    value={attribute.value}
                    data-testid={`${fieldName}.${index}.value`}
                    onChange={(_event, value) => updateValue(index, value)}
                    onBlur={() => update()}
                  />
                </FlexItem>
                <FlexItem>
                  <Button
                    variant="link"
                    title={t("removeAttribute")}
                    isDisabled={isDisabled}
                    onClick={() => remove(index)}
                    data-testid={`${fieldName}.${index}.remove`}
                  >
                    <MinusCircleIcon />
                  </Button>
                </FlexItem>
              </Flex>
            ))}
          </Flex>
          <ActionList>
            <ActionListItem>
              <Button
                data-testid={`${fieldName}-add-row`}
                className="pf-v5-u-px-0 pf-v5-u-mt-sm"
                variant="link"
                icon={<PlusCircleIcon />}
                onClick={() => appendNew()}
                isDisabled={isDisabled || map.some((e) => e.key === "")}
              >
                {t("addAttribute", { label: t(label!) })}
              </Button>
            </ActionListItem>
          </ActionList>
        </>
      ) : (
        <EmptyState
          data-testid={`${name}-empty-state`}
          className="pf-v5-u-p-0"
          variant="xs"
        >
          <EmptyStateBody>
            {t("missingAttributes", { label: t(label!) })}
          </EmptyStateBody>
          <EmptyStateFooter>
            <Button
              data-testid={`${name}-add-row`}
              variant="link"
              icon={<PlusCircleIcon />}
              size="sm"
              onClick={appendNew}
              isDisabled={isDisabled}
            >
              {t("addAttribute", { label: t(label!) })}
            </Button>
          </EmptyStateFooter>
        </EmptyState>
      )}
    </FormGroup>
  );
};
