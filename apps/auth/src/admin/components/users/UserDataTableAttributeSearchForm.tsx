/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/users/UserDataTableAttributeSearchForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type { UserProfileConfig } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import {
  KeycloakSelect,
  label,
  SelectVariant,
  useAlerts,
} from "../../../shared/keycloak-ui-shared";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Checkbox as UICheckbox } from "@metronome/ui/components/checkbox";
import { Input as UIInput } from "@metronome/ui/components/input";
import { SelectItem as UISelectItem } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { Check as CheckIcon } from "@phosphor-icons/react"
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Form } from "react-router-dom";
import { UserAttribute, UserFilter } from "./UserDataTable";
import { SelectOption } from "../../../shared/pf-compat"


const ActionGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-2 pt-2", className)} {...props}>{children}</div>
);
const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};
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
const Checkbox = ({ id, label, description, isChecked, isDisabled, onChange, name, ...props }: any) => (
  <div className="flex items-start gap-2">
    <UICheckbox id={id} name={name} checked={isChecked} disabled={isDisabled}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
);
const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
);
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);
const TextVariants = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "blockquote", pre: "pre", a: "a",
} as const;

type UserDataTableAttributeSearchFormProps = {
  activeFilters: UserFilter;
  setActiveFilters: (filters: UserFilter) => void;
  profile: UserProfileConfig;
  createAttributeSearchChips: () => ReactNode;
  searchUserWithAttributes: () => void;
  clearAllFilters: () => void;
};

type UserFilterForm = UserAttribute & { exact: boolean };

export function UserDataTableAttributeSearchForm({
  activeFilters,
  setActiveFilters,
  profile,
  createAttributeSearchChips,
  searchUserWithAttributes,
  clearAllFilters,
}: UserDataTableAttributeSearchFormProps) {
  const { t } = useTranslation();
  const { addAlert } = useAlerts();
  const [selectAttributeKeyOpen, setSelectAttributeKeyOpen] = useState(false);

  const defaultValues: UserAttribute = {
    name: "",
    displayName: "",
    value: "",
  };

  const {
    getValues,
    register,
    reset,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<UserFilterForm>({
    mode: "onChange",
    defaultValues,
  });

  const isAttributeKeyDuplicate = () => {
    return activeFilters.userAttribute.some(
      (filter) => filter.name === getValues().name,
    );
  };

  const isAttributeNameValid = () => {
    let valid = false;
    if (!getValues().name.length) {
      setError("name", {
        type: "empty",
        message: t("searchUserByAttributeMissingKeyError"),
      });
    } else if (
      activeFilters.userAttribute.some(
        (filter) => filter.name === getValues().name,
      )
    ) {
      setError("name", {
        type: "conflict",
        message: t("searchUserByAttributeKeyAlreadyInUseError"),
      });
    } else {
      valid = true;
    }
    return valid;
  };

  const isAttributeValueValid = () => {
    let valid = false;
    if (!getValues().value.length) {
      setError("value", {
        type: "empty",
        message: t("searchUserByAttributeMissingValueError"),
      });
    } else {
      valid = true;
    }
    return valid;
  };

  const isAttributeValid = () =>
    isAttributeNameValid() && isAttributeValueValid();

  const addToFilter = () => {
    if (isAttributeValid()) {
      setActiveFilters({
        ...activeFilters,
        userAttribute: [...activeFilters.userAttribute, { ...getValues() }],
      });
      reset(defaultValues);
    } else {
      if (errors.name?.message) {
        addAlert(errors.name.message, AlertVariant.danger);
      }

      if (errors.value?.message) {
        addAlert(errors.value.message, AlertVariant.danger);
      }
    }
  };

  const clearActiveFilters = () => {
    const filtered = [...activeFilters.userAttribute].filter(
      (chip) => chip.name !== chip.name,
    );
    setActiveFilters({ ...activeFilters, userAttribute: filtered });
    clearAllFilters();
  };

  const createAttributeKeyInputField = () => {
    if (profile) {
      return (
        <KeycloakSelect
          data-testid="search-attribute-name-select"
          variant={SelectVariant.typeahead}
          onToggle={(isOpen) => setSelectAttributeKeyOpen(isOpen)}
          selections={getValues().displayName}
          onSelect={(selectedValue) => {
            setValue("displayName", selectedValue.toString());
            if (isAttributeKeyDuplicate()) {
              setError("name", { type: "conflict" });
            } else {
              clearErrors("name");
            }
          }}
          isOpen={selectAttributeKeyOpen}
          placeholderText={t("selectAttribute")}
          validated={errors.name && "error"}
          maxHeight={300}
          {...register("displayName", {
            required: true,
            validate: isAttributeNameValid,
          })}
        >
          {profile.attributes?.map((option) => (
            <SelectOption
              key={option.name}
              value={label(t, option.displayName!, option.name)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectAttributeKeyOpen(false);
                setValue("name", option.name!);
              }}
            >
              {label(t, option.displayName!, option.name)}
            </SelectOption>
          ))}
        </KeycloakSelect>
      );
    } else {
      return (
        <TextInput
          id="name"
          placeholder={t("keyPlaceholder")}
          validated={errors.name && "error"}
          onKeyDown={(e) => e.key === "Enter" && addToFilter()}
          {...register("name", {
            required: true,
            validate: isAttributeNameValid,
          })}
        />
      );
    }
  };

  return (
    <Form
      className="user-attribute-search-form"
      data-testid="user-attribute-search-form"
    >
      <TextContent className="user-attribute-search-form-headline">
        <Text component={TextVariants.h2}>{t("selectAttributes")}</Text>
      </TextContent>
      <Alert
        isInline
        className="user-attribute-search-form-alert"
        variant="info"
        title={t("searchUserByAttributeDescription")}
        component="h3"
      />
      <TextContent className="user-attribute-search-form-key-value">
        <div className="user-attribute-search-form-left">
          <Text component={TextVariants.h3}>{t("key")}</Text>
        </div>
        <div className="user-attribute-search-form-right">
          <Text component={TextVariants.h3}>{t("value")}</Text>
        </div>
      </TextContent>
      <div className="user-attribute-search-form-left">
        {createAttributeKeyInputField()}
      </div>
      <div className="user-attribute-search-form-right">
        <InputGroup>
          <InputGroupItem>
            <TextInput
              id="value"
              placeholder={t("valuePlaceholder")}
              validated={errors.value && "error"}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToFilter();
                }
              }}
              {...register("value", {
                required: true,
                validate: isAttributeValueValid,
              })}
            />
          </InputGroupItem>
          <InputGroupItem>
            <Button
              data-testid="user-attribute-search-add-filter-button"
              variant="control"
              icon={<CheckIcon />}
              onClick={addToFilter}
              aria-label={t("addToFilter")}
            />
          </InputGroupItem>
        </InputGroup>
      </div>
      {createAttributeSearchChips()}

      <div className="pf-v5-u-pt-lg">
        <Checkbox
          id="exact"
          data-testid="exact"
          label={t("exactSearch")}
          isChecked={activeFilters.exact}
          onChange={(_, value) => {
            setActiveFilters({
              ...activeFilters,
              exact: value,
            });
          }}
        />
      </div>
      <ActionGroup className="user-attribute-search-form-action-group">
        <Button
          data-testid="search-user-attribute-btn"
          variant="primary"
          type="submit"
          isDisabled={!activeFilters.userAttribute.length}
          onClick={searchUserWithAttributes}
        >
          {t("search")}
        </Button>
        <Button
          variant={ButtonVariant.link}
          onClick={() => {
            reset();
            clearActiveFilters();
          }}
        >
          {t("reset")}
        </Button>
      </ActionGroup>
    </Form>
  );
}
