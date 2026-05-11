/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/themes/FileNameDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { TextControl } from "../../../shared/keycloak-ui-shared";
import { cn } from "@metronome/ui/lib/utils";
import { ConfirmDialogModal } from "../../components/confirm-dialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";


const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const ModalVariant = {
  small: "small",
  medium: "medium",
  large: "large",
  default: "default",
} as const;

type FileNameDialogProps = {
  onSave: (
    themeName: string,
    fileName: string,
    themeDescription: string,
  ) => void;
  onClose: () => void;
};

type FormValues = {
  themeName: string;
  fileName: string;
  themeDescription: string;
};

export const FileNameDialog = ({ onSave, onClose }: FileNameDialogProps) => {
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    defaultValues: {
      themeName: "quick-theme",
      fileName: "quick-theme.jar",
      themeDescription: t("themeDescriptionDefault"),
    },
  });
  const { handleSubmit, setValue, control } = form;

  const themeName = useWatch({ control, name: "themeName" });

  // Auto-update fileName when themeName changes
  useEffect(() => {
    setValue("fileName", `${themeName?.trim()}.jar`);
  }, [themeName, setValue]);

  const save = ({ themeName, fileName, themeDescription }: FormValues) =>
    onSave(themeName, fileName, themeDescription);

  return (
    <ConfirmDialogModal
      titleKey="fileNameDialogTitle"
      open
      variant={ModalVariant.medium}
      toggleDialog={onClose}
      onConfirm={() => handleSubmit(save)()}
    >
      <Form isHorizontal onSubmit={handleSubmit(save)}>
        <FormProvider {...form}>
          <TextControl name="themeName" label={t("themeName")} />
          <TextControl name="fileName" label={t("fileName")} />
          <TextControl name="themeDescription" label={t("themeDescription")} />
        </FormProvider>
      </Form>
    </ConfirmDialogModal>
  );
};
