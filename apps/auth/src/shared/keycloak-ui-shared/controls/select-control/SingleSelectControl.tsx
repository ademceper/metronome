/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/select-control/SingleSelectControl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Select as UISelect, SelectContent as UISelectContent, SelectItem as UISelectItem, SelectTrigger as UISelectTrigger, SelectValue as UISelectValue } from "@metronome/ui/components/select";
import { get } from "lodash-es";
import { useState } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { getRuleValue } from "../../utils/getRuleValue";
import { FormLabel } from "../FormLabel";
import {
  SelectControlProps,
  isSelectBasedOptions,
  isString,
  key,
} from "./SelectControl";
import { Select, SelectOption } from "../../../pf-compat"


const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const MenuToggleStatus = {
  default: "default",
  success: "success",
  warning: "warning",
  danger: "danger",
} as const;
const SelectList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);

export const SingleSelectControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  id,
  name,
  label,
  options,
  selectedOptions = [],
  controller,
  labelIcon,
  isDisabled,
  isFullWidth = true,
  onSelect,
  ...rest
}: SelectControlProps<T, P>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const required = getRuleValue(controller.rules?.required) === true;

  return (
    <FormLabel
      id={id}
      name={name}
      label={label}
      isRequired={required}
      error={get(errors, name)}
      labelIcon={labelIcon}
    >
      <Controller
        {...controller}
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            {...rest}
            variant="default"
            onClick={() => setOpen(!open)}
            onOpenChange={() => setOpen(false)}
            selected={
              isSelectBasedOptions(options)
                ? options
                    .filter((o) =>
                      Array.isArray(value)
                        ? value.includes(o.key)
                        : value === o.key,
                    )
                    .map((o) => o.value)
                : value
            }
            toggle={(ref) => (
              <MenuToggle
                id={id || name}
                ref={ref}
                onClick={() => setOpen(!open)}
                isExpanded={open}
                isFullWidth={isFullWidth}
                status={get(errors, name) ? MenuToggleStatus.danger : undefined}
                aria-label={label}
                isDisabled={isDisabled}
              >
                {isSelectBasedOptions(options)
                  ? options.find(
                      (o) =>
                        o.key === (Array.isArray(value) ? value[0] : value),
                    )?.value
                  : value}
              </MenuToggle>
            )}
            onSelect={(_event, v) => {
              const option = v?.toString()!;
              const convertedValue = Array.isArray(value) ? [option] : option;
              if (onSelect) {
                onSelect(convertedValue, onChange);
              } else {
                onChange(convertedValue);
              }
              setOpen(false);
            }}
            isOpen={open}
          >
            <SelectList data-testid={`select-${name}`}>
              {[...options, ...selectedOptions].map((option) => (
                <SelectOption
                  key={key(option)}
                  value={key(option)}
                  description={
                    !isString(option) && "description" in option
                      ? option.description
                      : undefined
                  }
                >
                  {isString(option) ? option : option.value}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
        )}
      />
    </FormLabel>
  );
};
