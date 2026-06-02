/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/user-credentials/ResetCredentialDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { RequiredActionAlias } from "@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation";
import { cn } from "@metronome/ui/lib/utils";
import { isEmpty } from "lodash-es";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { ConfirmDialogModal } from "../../confirm-dialog/ConfirmDialog";
import { LifespanField } from "./LifespanField";
import { RequiredActionMultiSelect } from "./RequiredActionMultiSelect";
import { useRealm } from "../../../context/realm-context/realm-context";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const ModalVariant = {
  small: "small",
  medium: "medium",
  large: "large",
  default: "default",
} as const;

type ResetCredentialDialogProps = {
  userId: string;
  onClose: () => void;
};

type CredentialResetForm = {
  actions: RequiredActionAlias[];
  lifespan: number | undefined;
};

export const ResetCredentialDialog = ({
  userId,
  onClose,
}: ResetCredentialDialogProps) => {
  const { adminClient } = useAdminClient();
  const { realmRepresentation: realm } = useRealm();
  const { t } = useTranslation();
  const form = useForm<CredentialResetForm>({
    defaultValues: {
      actions: [],
      lifespan: realm?.actionTokenGeneratedByAdminLifespan,
    },
  });
  const { handleSubmit, control } = form;

  const resetActionWatcher = useWatch({
    control,
    name: "actions",
  });
  const resetIsNotDisabled = !isEmpty(resetActionWatcher);

  const { addAlert, addError } = useAlerts();

  const sendCredentialsResetEmail = async ({
    actions,
    lifespan,
  }: CredentialResetForm) => {
    if (isEmpty(actions)) {
      return;
    }

    try {
      await adminClient.users.executeActionsEmail({
        id: userId,
        actions,
        lifespan,
      });
      addAlert(t("credentialResetEmailSuccess"), AlertVariant.success);
      onClose();
    } catch (error) {
      addError("credentialResetEmailError", error);
    }
  };

  return (
    <ConfirmDialogModal
      variant={ModalVariant.medium}
      titleKey="credentialReset"
      open
      onCancel={onClose}
      toggleDialog={onClose}
      continueButtonLabel="credentialResetConfirm"
      onConfirm={async () => {
        await handleSubmit(sendCredentialsResetEmail)();
      }}
      confirmButtonDisabled={!resetIsNotDisabled}
    >
      <Form
        id="userCredentialsReset-form"
        isHorizontal
        data-testid="credential-reset-modal"
      >
        <FormProvider {...form}>
          <RequiredActionMultiSelect
            name="actions"
            label="resetAction"
            help="resetActions"
          />
          <LifespanField />
        </FormProvider>
      </Form>
    </ConfirmDialogModal>
  );
};
