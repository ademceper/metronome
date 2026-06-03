/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/DetailOraganzationHeader.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { DropdownMenuItem as UIDropdownMenuItem } from "@metronome/ui/components/dropdown-menu";
import { ViewHeader } from "../view-header/view-header";
import { useTranslation } from "react-i18next";
import { useConfirmDialog } from "../confirm-dialog/confirm-dialog";
import { useAdminClient } from "../../admin-client";
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { toOrganizations } from "../../lib/organizations";
import { useRealm } from "../../context/realm-context/realm-context";


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
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);

type DetailOrganizationHeaderProps = {
  save: () => void;
};

export const DetailOrganizationHeader = ({
  save,
}: DetailOrganizationHeaderProps) => {
  const { adminClient } = useAdminClient();
  const { realm } = useRealm();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const id = useWatch({ name: "id" });
  const name = useWatch({ name: "name" });

  const { setValue } = useFormContext();

  const [toggleDisableDialog, DisableConfirm] = useConfirmDialog({
    titleKey: "disableConfirmOrganizationTitle",
    messageKey: "disableConfirmOrganization",
    continueButtonLabel: "disable",
    onConfirm: () => {
      setValue("enabled", false);
      save();
    },
  });

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "organizationDelete",
    messageKey: "organizationDeleteConfirm",
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.organizations.delById({ id });
        addAlert(t("organizationDeletedSuccess"));
        navigate(toOrganizations({ realm }));
      } catch (error) {
        addError("organizationDeleteError", error);
      }
    },
  });

  return (
    <Controller
      name="enabled"
      render={({ field: { value, onChange } }) => (
        <>
          <DeleteConfirm />
          <DisableConfirm />
          <ViewHeader
            titleKey={name || ""}
            divider={false}
            dropdownItems={[
              <DropdownItem
                data-testid="delete-client"
                key="delete"
                onClick={toggleDeleteDialog}
              >
                {t("delete")}
              </DropdownItem>,
            ]}
            isEnabled={value}
            onToggle={(value) => {
              if (!value) {
                toggleDisableDialog();
              } else {
                onChange(value);
                save();
              }
            }}
          />
        </>
      )}
    />
  );
};
