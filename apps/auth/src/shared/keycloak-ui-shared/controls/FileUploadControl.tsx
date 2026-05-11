/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/FileUploadControl.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { Input as UIInput } from "@metronome/ui/components/input";
import { ReactNode, useState } from "react";
import {
  FieldPath,
  FieldValues,
  PathValue,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { getRuleValue } from "../utils/getRuleValue";
import { FormLabel } from "./FormLabel";
import { useTranslation } from "react-i18next";


const FileUpload = ({ id, value, onChange, filename, onFileInputChange, accept, isReadOnly, isDisabled, ...props }: any) => (
  <UIInput id={id} type="file" accept={accept} disabled={isDisabled}
    onChange={(e: any) => {
      const file = e.target.files?.[0];
      onChange?.(e, file?.name ?? "");
      onFileInputChange?.(e, file);
    }} {...props} />
);
const ValidatedOptions = {
  default: "default",
  success: "success",
  warning: "warning",
  error: "error",
} as const;
type FileUploadProps = React.ComponentProps<typeof FileUpload>;

export type FileUploadControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, P> &
  Omit<FileUploadProps, "name" | "isRequired" | "required"> & {
    label: string;
    labelIcon?: string | ReactNode;
    isDisabled?: boolean;
    "data-testid"?: string;
    type?: string;
  };

export const FileUploadControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>(
  props: FileUploadControlProps<T, P>,
) => {
  const { labelIcon, ...rest } = props;
  const required = !!getRuleValue(props.rules?.required);
  const defaultValue = props.defaultValue ?? ("" as PathValue<T, P>);

  const { t } = useTranslation();

  const [filename, setFilename] = useState<string>("");

  const { field, fieldState } = useController({
    ...props,
    defaultValue,
  });

  return (
    <FormLabel
      name={props.name}
      label={props.label}
      labelIcon={labelIcon}
      isRequired={required}
      error={fieldState.error}
    >
      <FileUpload
        isRequired={required}
        data-testid={props["data-testid"] || props.name}
        filename={filename}
        browseButtonText={t("browse")}
        validated={
          fieldState.error ? ValidatedOptions.error : ValidatedOptions.default
        }
        hideDefaultPreview
        isDisabled={props.isDisabled}
        type="text"
        onFileInputChange={(_, file) => {
          field.onChange(file);
          setFilename(file.name);
        }}
        onClearClick={() => {
          field.onChange(null);
          setFilename("");
        }}
        {...rest}
        {...field}
      />
    </FormLabel>
  );
};
