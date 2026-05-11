/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user-federation/shared/ExtendedHeader.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";
import { Header } from "./Header";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Divider = (props: any) => <UISeparator {...props} />;
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);

type ExtendedHeaderProps = {
  provider: string;
  editMode?: string | string[];
  save: () => void;
  noDivider?: boolean;
};

export const ExtendedHeader = ({
  provider,
  editMode,
  save,
  noDivider = false,
}: ExtendedHeaderProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { addAlert, addError } = useAlerts();

  const { control } = useFormContext();
  const hasImportUsers = useWatch({
    name: "config.importEnabled",
    control,
    defaultValue: ["true"],
  })[0];

  const [toggleUnlinkUsersDialog, UnlinkUsersDialog] = useConfirmDialog({
    titleKey: "userFedUnlinkUsersConfirmTitle",
    messageKey: "userFedUnlinkUsersConfirm",
    continueButtonLabel: "unlinkUsers",
    onConfirm: () => unlinkUsers(),
  });

  const [toggleRemoveUsersDialog, RemoveUsersConfirm] = useConfirmDialog({
    titleKey: t("removeImportedUsers"),
    messageKey: t("removeImportedUsersMessage"),
    continueButtonLabel: "remove",
    onConfirm: async () => {
      await removeImportedUsers();
    },
  });

  const removeImportedUsers = async () => {
    try {
      if (id) {
        await adminClient.userStorageProvider.removeImportedUsers({ id });
        addAlert(t("removeImportedUsersSuccess"), AlertVariant.success);
      }
    } catch (error) {
      addError("removeImportedUsersError", error);
    }
  };

  const syncChangedUsers = async () => {
    try {
      if (id) {
        addAlert(t("syncUsersStarted"), AlertVariant.info);
        const response = await adminClient.userStorageProvider.sync({
          id: id,
          action: "triggerChangedUsersSync",
        });
        if (response.ignored) {
          addAlert(`${response.status}.`, AlertVariant.warning);
        } else {
          addAlert(
            t("syncUsersSuccess") +
              `${response.added} users added, ${response.updated} users updated, ${response.removed} users removed, ${response.failed} users failed.`,
            AlertVariant.success,
          );
        }
      }
    } catch (error) {
      addError("syncUsersError", error);
    }
  };

  const syncAllUsers = async () => {
    try {
      if (id) {
        addAlert(t("syncUsersStarted"), AlertVariant.info);
        const response = await adminClient.userStorageProvider.sync({
          id: id,
          action: "triggerFullSync",
        });
        if (response.ignored) {
          addAlert(`${response.status}.`, AlertVariant.warning);
        } else {
          addAlert(
            t("syncUsersSuccess") +
              `${response.added} users added, ${response.updated} users updated, ${response.removed} users removed, ${response.failed} users failed.`,
            AlertVariant.success,
          );
        }
      }
    } catch (error) {
      addError("syncUsersError", error);
    }
  };

  const unlinkUsers = async () => {
    try {
      if (id) {
        await adminClient.userStorageProvider.unlinkUsers({ id });
      }
      addAlert(t("unlinkUsersSuccess"), AlertVariant.success);
    } catch (error) {
      addError("unlinkUsersError", error);
    }
  };

  return (
    <>
      <UnlinkUsersDialog />
      <RemoveUsersConfirm />
      <Header
        provider={provider}
        noDivider={noDivider}
        save={save}
        dropdownItems={[
          <DropdownItem
            key="sync"
            onClick={syncChangedUsers}
            isDisabled={hasImportUsers === "false"}
          >
            {t("syncChangedUsers")}
          </DropdownItem>,
          <DropdownItem
            key="syncall"
            onClick={syncAllUsers}
            isDisabled={hasImportUsers === "false"}
          >
            {t("syncAllUsers")}
          </DropdownItem>,
          <DropdownItem
            key="unlink"
            isDisabled={editMode ? editMode.includes("UNSYNCED") : false}
            onClick={toggleUnlinkUsersDialog}
          >
            {t("unlinkUsers")}
          </DropdownItem>,
          <DropdownItem key="remove" onClick={toggleRemoveUsersDialog}>
            {t("removeImported")}
          </DropdownItem>,
          <Divider key="separator" />,
        ]}
      />
    </>
  );
};
