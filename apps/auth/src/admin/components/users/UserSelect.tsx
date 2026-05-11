/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/users/UserSelect.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import {
  FormErrorText,
  HelpItem,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Select as UISelect, SelectContent as UISelectContent, SelectItem as UISelectItem, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@metronome/ui/components/select";
import { cn } from "@metronome/ui/lib/utils";
import { X as TimesIcon } from "@phosphor-icons/react"
import { debounce } from "lodash-es";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import useToggle from "../../utils/useToggle";
import type { ComponentProps } from "../dynamic/components";
import { Select, SelectOption } from "../../../shared/pf-compat"


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
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const SelectList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const TextInputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const TextInputGroupMain = ({ children, ...props }: any) => (
  <div className="flex-1" {...props}>{children}</div>
);
const TextInputGroupUtilities = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>{children}</div>
);

type UserSelectVariant = "typeaheadMulti" | "typeahead";

type UserSelectProps = Omit<ComponentProps, "convertToName"> & {
  variant?: UserSelectVariant;
  isRequired?: boolean;
};

export const UserSelect = ({
  name,
  label,
  helpText,
  defaultValue,
  isRequired,
  variant = "typeaheadMulti",
}: UserSelectProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext();
  const values: string[] | undefined = getValues(name!);

  const [open, toggleOpen, setOpen] = useToggle();
  const [selectedUsers, setSelectedUsers] = useState<UserRepresentation[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<UserRepresentation[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const textInputRef = useRef<HTMLInputElement>();

  const debounceFn = useCallback(debounce(setSearch, 500), []);

  useFetch(
    async () => {
      if (!values) {
        return [];
      }

      const foundUsers = await Promise.all(
        values.map((id) => adminClient.users.findOne({ id })),
      );

      return foundUsers.filter((user) => user !== undefined);
    },
    (users) => {
      setSelectedUsers(users);
      if (variant !== "typeaheadMulti") {
        setInputValue(users[0]?.username || "");
      }
    },
    [values],
  );

  useFetch(
    async () =>
      adminClient.users.find({
        username: search,
        max: 20,
      }),
    setSearchedUsers,
    [search],
  );

  useEffect(() => {
    if (!values || values.length === 0) {
      setSelectedUsers([]);
      setInputValue("");
    }
  }, [values]);

  const users = useMemo(
    () => [...selectedUsers, ...searchedUsers],
    [selectedUsers, searchedUsers],
  );

  const convert = (users: UserRepresentation[]) =>
    users.map((option) => (
      <SelectOption
        key={option.id}
        value={option.id}
        selected={values?.includes(option.id!)}
      >
        {option.username}
      </SelectOption>
    ));

  return (
    <FormGroup
      label={t(label!)}
      isRequired={isRequired}
      labelIcon={<HelpItem helpText={helpText!} fieldLabelId={t(label!)} />}
      fieldId={name!}
    >
      <Controller
        name={name!}
        defaultValue={defaultValue}
        control={control}
        rules={
          isRequired && variant === "typeaheadMulti"
            ? { validate: (value) => value.length > 0 }
            : { required: isRequired }
        }
        render={({ field }) => (
          <Select
            id={name!}
            onOpenChange={toggleOpen}
            toggle={(ref) => (
              <MenuToggle
                data-testid={name!}
                ref={ref}
                variant="typeahead"
                onClick={toggleOpen}
                isExpanded={open}
                isFullWidth
                status={errors[name!] ? "danger" : undefined}
              >
                <TextInputGroup isPlain>
                  <TextInputGroupMain
                    value={inputValue}
                    onClick={toggleOpen}
                    onChange={(_, value) => {
                      setOpen(true);
                      setInputValue(value);
                      debounceFn(value);
                    }}
                    autoComplete="off"
                    innerRef={textInputRef}
                    placeholderText={t("selectAUser")}
                    {...(field.value && {
                      "aria-activedescendant": field.value,
                    })}
                    role="combobox"
                    isExpanded={open}
                    aria-controls="select-create-typeahead-listbox"
                  >
                    {variant === "typeaheadMulti" &&
                      Array.isArray(field.value) && (
                        <ChipGroup aria-label="Current selections">
                          {field.value.map(
                            (selection: string, index: number) => (
                              <Chip
                                key={index}
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  field.onChange(
                                    field.value.filter(
                                      (item: string) => item !== selection,
                                    ),
                                  );
                                }}
                              >
                                {
                                  users.find((u) => u?.id === selection)
                                    ?.username
                                }
                              </Chip>
                            ),
                          )}
                        </ChipGroup>
                      )}
                  </TextInputGroupMain>
                  <TextInputGroupUtilities>
                    {!!search && (
                      <Button
                        variant="plain"
                        onClick={() => {
                          setInputValue("");
                          setSearch("");
                          field.onChange([]);
                          textInputRef?.current?.focus();
                        }}
                        aria-label="Clear input value"
                      >
                        <TimesIcon aria-hidden />
                      </Button>
                    )}
                  </TextInputGroupUtilities>
                </TextInputGroup>
              </MenuToggle>
            )}
            isOpen={open}
            selected={field.value}
            onSelect={(_, v) => {
              const option = v?.toString();
              if (variant !== "typeaheadMulti") {
                const removed = field.value.includes(option);

                if (removed) {
                  field.onChange([]);
                } else {
                  field.onChange([option]);
                }

                setInputValue(
                  removed
                    ? ""
                    : users.find((u) => u?.id === option)?.username || "",
                );
                setOpen(false);
              } else {
                const changedValue = field.value.find(
                  (v: string) => v === option,
                )
                  ? field.value.filter((v: string) => v !== option)
                  : [...field.value, option];
                field.onChange(changedValue);
              }
            }}
            aria-label={t(name!)}
          >
            <SelectList>{convert(searchedUsers)}</SelectList>
          </Select>
        )}
      />
      {errors[name!] && <FormErrorText message={t("required")} />}
    </FormGroup>
  );
};
