/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/json-file-upload/JsonFileUpload.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { FileUploadForm, FileUploadFormProps } from "./file-upload-form";

export type JsonFileUploadProps = Omit<
  FileUploadFormProps,
  "onChange" | "language" | "extension"
> & {
  onChange: (obj: object) => void;
};

export const JsonFileUpload = ({ onChange, ...props }: JsonFileUploadProps) => {
  const handleChange = (value: string) => {
    try {
      onChange(JSON.parse(value));
    } catch {
      onChange({});
      console.warn("Invalid json, ignoring value using {}");
    }
  };

  return (
    <FileUploadForm
      {...props}
      language="json"
      extension=".json"
      onChange={handleChange}
    />
  );
};
