/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/themes/ColorControl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { TextControl } from "../../../shared/keycloak-ui-shared";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";


const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);
const InputGroup = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-stretch gap-0", className)} {...props}>{children}</div>
);
const InputGroupItem = ({ isFill, children, className, ...props }: any) => (
  <div className={cn(isFill && "flex-1", className)} {...props}>{children}</div>
);
type TextInputProps = React.ComponentProps<typeof TextInput>;

export type ColorControlProps = TextInputProps & {
  name: string;
  label: string;
  color: string;
  onUserChange?: () => void;
};

export const ColorControl = ({
  name,
  color,
  label,
  onUserChange,
  ...props
}: ColorControlProps) => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();
  const currentValue = useWatch({
    control,
    name,
  });

  const handleChange = (value: string) => {
    setValue(name, value);
    if (onUserChange) {
      onUserChange();
    }
  };

  return (
    <InputGroup>
      <InputGroupItem isFill>
        <TextControl {...props} name={name} label={t(label)} />
      </InputGroupItem>
      <input
        type="color"
        value={currentValue || color}
        onChange={(e) => handleChange(e.target.value)}
      />
    </InputGroup>
  );
};
