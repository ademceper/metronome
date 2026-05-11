/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/dynamic/FileComponent.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { HelpItem } from "../../../shared/keycloak-ui-shared";
import { Input as UIInput } from "@metronome/ui/components/input";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ComponentProps } from "./components";


const FileUpload = ({ id, value, onChange, filename, onFileInputChange, accept, isReadOnly, isDisabled, ...props }: any) => (
  <UIInput id={id} type="file" accept={accept} disabled={isDisabled}
    onChange={(e: any) => {
      const file = e.target.files?.[0];
      onChange?.(e, file?.name ?? "");
      onFileInputChange?.(e, file);
    }} {...props} />
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

export const FileComponent = ({
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
  const [filename, setFilename] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <FormGroup
      label={t(label!)}
      labelIcon={<HelpItem helpText={t(helpText!)} fieldLabelId={`${label}`} />}
      fieldId={name!}
      isRequired={required}
    >
      <Controller
        name={convertToName(name!)}
        control={control}
        defaultValue={defaultValue || ""}
        render={({ field }) => (
          <FileUpload
            id={name!}
            value={field.value}
            type="text"
            filename={filename}
            isDisabled={isDisabled}
            onFileInputChange={(_, file) => setFilename(file.name)}
            onReadStarted={() => setIsLoading(true)}
            onReadFinished={() => setIsLoading(false)}
            onClearClick={() => {
              field.onChange("");
              setFilename("");
            }}
            isLoading={isLoading}
            allowEditingUploadedText={false}
            onTextChange={(value) => {
              field.onChange(value);
            }}
            onDataChange={(_, value) => {
              field.onChange(value);
            }}
          />
        )}
      />
    </FormGroup>
  );
};
