/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/keys/SamlImportKeyDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { ConfirmDialogModal } from "../../confirm-dialog/confirm-dialog";
import { KeyForm } from "./generate-key-dialog";
import type { KeyTypes } from "./saml-keys";
import { SamlKeysDialogForm, submitForm } from "./saml-keys-dialog";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;

type SamlImportKeyDialogProps = {
  id: string;
  attr: KeyTypes;
  onClose: () => void;
  onImported: () => void;
};

export const SamlImportKeyDialog = ({
  id,
  attr,
  onClose,
  onImported,
}: SamlImportKeyDialogProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm<SamlKeysDialogForm>();
  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const { addAlert, addError } = useAlerts();

  const submit = async (form: SamlKeysDialogForm) => {
    await submitForm(adminClient, form, id, attr, (error) => {
      if (error) {
        addError("importError", error);
      } else {
        addAlert(t("importSuccess"), AlertVariant.success);
        onImported();
      }
    });
  };

  return (
    <ConfirmDialogModal
      open={true}
      toggleDialog={onClose}
      continueButtonLabel="import"
      titleKey="importKey"
      confirmButtonDisabled={!isValid}
      onConfirm={async () => {
        await handleSubmit(submit)();
      }}
    >
      <FormProvider {...form}>
        <KeyForm useFile hasPem />
      </FormProvider>
    </ConfirmDialogModal>
  );
};
