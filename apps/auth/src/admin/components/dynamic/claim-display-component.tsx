/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/ClaimDisplayComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { MinusCircle as MinusCircleIcon, PlusCircle as PlusCircleIcon } from "@phosphor-icons/react"
import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../../shared/keycloak-ui-shared";
import type { ComponentProps } from "./components";


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

type ClaimDisplayEntry = {
  name: string;
  locale: string;
};

type IdClaimDisplayEntry = ClaimDisplayEntry & {
  id: string;
};

const generateId = () => crypto.randomUUID();

export const ClaimDisplayComponent = ({
  name,
  label,
  helpText,
  required,
  isDisabled,
  defaultValue,
  convertToName,
}: ComponentProps) => {
  const { t } = useTranslation();
  const { getValues, setValue, register } = useFormContext();
  const [displays, setDisplays] = useState<IdClaimDisplayEntry[]>([]);
  const fieldName = convertToName(name!);
  const debounceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    register(fieldName);
    const value = getValues(fieldName) || defaultValue;

    try {
      const parsed: ClaimDisplayEntry[] = value
        ? typeof value === "string"
          ? JSON.parse(value)
          : value
        : [];
      setDisplays(parsed.map((entry) => ({ ...entry, id: generateId() })));
    } catch {
      setDisplays([]);
    }
  }, [defaultValue, fieldName, getValues, register]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current !== null) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const appendNew = () => {
    const newDisplays = [
      ...displays,
      { name: "", locale: "", id: generateId() },
    ];
    setDisplays(newDisplays);
    syncFormValue(newDisplays);
  };

  const syncFormValue = (val = displays) => {
    const filteredEntries = val
      .filter((e) => e.name !== "" && e.locale !== "")
      .map((entry) => ({ name: entry.name, locale: entry.locale }));

    setValue(fieldName, JSON.stringify(filteredEntries), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const debouncedUpdate = (val: IdClaimDisplayEntry[]) => {
    if (debounceTimeoutRef.current !== null) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = window.setTimeout(() => {
      syncFormValue(val);
      debounceTimeoutRef.current = null;
    }, 300);
  };

  const flushUpdate = () => {
    if (debounceTimeoutRef.current !== null) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    syncFormValue();
  };

  const updateName = (index: number, name: string) => {
    const newDisplays = [
      ...displays.slice(0, index),
      { ...displays[index], name },
      ...displays.slice(index + 1),
    ];
    setDisplays(newDisplays);
    debouncedUpdate(newDisplays);
  };

  const updateLocale = (index: number, locale: string) => {
    const newDisplays = [
      ...displays.slice(0, index),
      { ...displays[index], locale },
      ...displays.slice(index + 1),
    ];
    setDisplays(newDisplays);
    debouncedUpdate(newDisplays);
  };

  const remove = (index: number) => {
    const value = [...displays.slice(0, index), ...displays.slice(index + 1)];
    setDisplays(value);
    syncFormValue(value);
  };

  return displays.length !== 0 ? (
    <FormGroup
      label={t(label!)}
      labelIcon={<HelpItem helpText={t(helpText!)} fieldLabelId={`${label}`} />}
      fieldId={name!}
      isRequired={required}
    >
      <Flex direction={{ default: "column" }}>
        <Flex>
          <FlexItem flex={{ default: "flex_1" }}>
            <strong>{t("claimDisplayName")}</strong>
          </FlexItem>
          <FlexItem flex={{ default: "flex_1" }}>
            <strong>{t("claimDisplayLocale")}</strong>
          </FlexItem>
        </Flex>
        {displays.map((display, index) => (
          <Flex key={display.id} data-testid="claim-display-row">
            <FlexItem flex={{ default: "flex_1" }}>
              <TextInput
                id={`${fieldName}.${index}.name`}
                data-testid={`${fieldName}.${index}.name`}
                value={display.name}
                onChange={(_event, value) => updateName(index, value)}
                onBlur={() => flushUpdate()}
                isDisabled={isDisabled}
                placeholder={t("claimDisplayNamePlaceholder")}
              />
            </FlexItem>
            <FlexItem flex={{ default: "flex_1" }}>
              <TextInput
                id={`${fieldName}.${index}.locale`}
                data-testid={`${fieldName}.${index}.locale`}
                value={display.locale}
                onChange={(_event, value) => updateLocale(index, value)}
                onBlur={() => flushUpdate()}
                isDisabled={isDisabled}
                placeholder={t("claimDisplayLocalePlaceholder")}
              />
            </FlexItem>
            <FlexItem>
              <Button
                variant="link"
                title={t("removeClaimDisplay")}
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
          >
            {t("addClaimDisplay")}
          </Button>
        </ActionListItem>
      </ActionList>
    </FormGroup>
  ) : (
    <EmptyState
      data-testid={`${fieldName}-empty-state`}
      className="pf-v5-u-p-0"
      variant="xs"
    >
      <EmptyStateBody>{t("noClaimDisplayEntries")}</EmptyStateBody>
      <EmptyStateFooter>
        <Button
          data-testid={`${fieldName}-add-row`}
          variant="link"
          icon={<PlusCircleIcon />}
          size="sm"
          onClick={appendNew}
          isDisabled={isDisabled}
        >
          {t("addClaimDisplay")}
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );
};
