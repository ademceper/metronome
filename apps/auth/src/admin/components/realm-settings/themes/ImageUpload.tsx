/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/themes/ImageUpload.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { KeycloakSpinner } from "../../../../shared/keycloak-ui-shared";
import { Input as UIInput } from "@metronome/ui/components/input";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { fileToDataUri } from "./fileUtils";


const FileUpload = ({ id, value, onChange, filename, onFileInputChange, accept, isReadOnly, isDisabled, ...props }: any) => (
  <UIInput id={id} type="file" accept={accept} disabled={isDisabled}
    onChange={(e: any) => {
      const file = e.target.files?.[0];
      onChange?.(e, file?.name ?? "");
      onFileInputChange?.(e, file);
    }} {...props} />
);

type ImageUploadProps = {
  name: string;
  onChange?: (file: string) => void;
};

export const ImageUpload = ({ name, onChange }: ImageUploadProps) => {
  const [dataUri, setDataUri] = useState("");
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);

  const { control, watch } = useFormContext();

  if (file) {
    void fileToDataUri(file).then((dataUri) => {
      setDataUri(dataUri);
      onChange?.(dataUri);
    });
  }

  const loadedFile = watch(name);
  useEffect(() => {
    (() => {
      if (loadedFile) {
        void fileToDataUri(loadedFile).then((dataUri) => {
          setDataUri(dataUri);
        });
      }
    })();
  }, [loadedFile]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <>
          {isLoading && <KeycloakSpinner />}
          {dataUri && <img src={dataUri} width={200} height={200} />}
          <FileUpload
            id={name}
            type="dataURL"
            filename={file?.name}
            dropzoneProps={{
              accept: {
                "image/*": [".png", ".gif", ".jpeg", ".jpg", ".svg", ".webp"],
              },
            }}
            onFileInputChange={(_, file) => setFile(file)}
            onReadStarted={() => setIsLoading(true)}
            onReadFinished={(_, file) => {
              setFile(file);
              field.onChange(file);
              setIsLoading(false);
            }}
            onClearClick={() => {
              setFile(undefined);
              field.onChange(undefined);
              setDataUri("");
            }}
          />
        </>
      )}
    />
  );
};
