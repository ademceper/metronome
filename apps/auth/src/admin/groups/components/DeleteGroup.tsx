/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/components/DeleteGroup.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { useTranslation } from "react-i18next";
import { useGroupResource } from "../../context/group-resource/GroupResourceContext";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { ConfirmDialogModal } from "../../components/confirm-dialog/ConfirmDialog";


const ButtonVariant = {
  primary: "default",
  secondary: "secondary",
  tertiary: "outline",
  danger: "destructive",
  warning: "destructive",
  link: "link",
  plain: "ghost",
  control: "outline",
} as const;

type DeleteConfirmProps = {
  selectedRows: GroupRepresentation[];
  show: boolean;
  toggleDialog: () => void;
  refresh: () => void;
};

export const DeleteGroup = ({
  selectedRows,
  show,
  toggleDialog,
  refresh,
}: DeleteConfirmProps) => {
  const groups = useGroupResource();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const multiDelete = async () => {
    try {
      for (const group of selectedRows) {
        await groups.del({
          id: group.id!,
        });
      }
      refresh();
      addAlert(t("groupDeleted", { count: selectedRows.length }));
    } catch (error) {
      addError("groupDeleteError", error);
    }
  };

  return (
    <ConfirmDialogModal
      titleKey={t("deleteConfirmTitle", { count: selectedRows.length })}
      messageKey={t("deleteConfirmGroup", {
        count: selectedRows.length,
        groupName: selectedRows[0]?.name,
      })}
      continueButtonLabel="delete"
      continueButtonVariant={ButtonVariant.danger}
      onConfirm={multiDelete}
      open={show}
      toggleDialog={toggleDialog}
    />
  );
};
