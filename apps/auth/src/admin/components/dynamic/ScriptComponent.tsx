/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/ScriptComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { HelpItem } from "../../../shared/keycloak-ui-shared";
import { cn } from "@metronome/ui/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CodeEditor from "../form/CodeEditor";
import type { ComponentProps } from "./components";


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

export const ScriptComponent = ({
  name,
  label,
  helpText,
  defaultValue,
  required,
  isDisabled = false,
  convertToName,
}: ComponentProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormGroup
      label={t(label!)}
      labelIcon={
        <HelpItem
          helpText={<span style={{ whiteSpace: "pre-wrap" }}>{helpText}</span>}
          fieldLabelId={`${label}`}
        />
      }
      fieldId={name!}
      isRequired={required}
    >
      <Controller
        name={convertToName(name!)}
        defaultValue={defaultValue}
        control={control}
        render={({ field }) => (
          <CodeEditor
            id={name!}
            data-testid={name}
            readOnly={isDisabled}
            onChange={field.onChange}
            value={Array.isArray(field.value) ? field.value[0] : field.value}
            language="js"
            height={600}
          />
        )}
      />
    </FormGroup>
  );
};
