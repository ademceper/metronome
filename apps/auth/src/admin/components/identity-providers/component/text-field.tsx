/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/identity-providers/component/TextField.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Input as UIInput } from "@metronome/ui/components/input";
import { useFormContext } from "react-hook-form";

import { FieldProps, FormGroupField } from "./form-group-field";


const TextInput = ({ value, onChange, isDisabled, isReadOnly, isRequired, validated, type, ...props }: any) => (
  <UIInput value={value ?? ""}
    onChange={(e: any) => onChange?.(e.target.value, e)}
    disabled={isDisabled} readOnly={isReadOnly} required={isRequired}
    type={type || "text"} {...props} />
);

export const TextField = ({ label, field, isReadOnly = false }: FieldProps) => {
  const { register } = useFormContext();
  return (
    <FormGroupField label={label}>
      <TextInput
        id={label}
        data-testid={label}
        readOnly={isReadOnly}
        {...register(field)}
      />
    </FormGroupField>
  );
};
