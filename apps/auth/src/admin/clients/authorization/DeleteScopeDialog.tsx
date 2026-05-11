/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/DeleteScopeDialog.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation";
import { Alert as UIAlert, AlertDescription as UIAlertDescription, AlertTitle as UIAlertTitle } from "@metronome/ui/components/alert";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { ConfirmDialogModal } from "../../components/confirm-dialog/ConfirmDialog";
import type { PermissionScopeRepresentation } from "./Scopes";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Alert = ({ variant, title, isInline, isPlain, isLiveRegion, customIcon, actionClose, actionLinks, component, children, ...props }: any) => {
  const v = (AlertVariant as any)[variant] ?? "default";
  return (
    <UIAlert variant={v as any} {...props}>
      {title ? <UIAlertTitle>{title}</UIAlertTitle> : null}
      {children ? <UIAlertDescription>{children}</UIAlertDescription> : null}
      {actionLinks}
      {actionClose}
    </UIAlert>
  );
};

type DeleteScopeDialogProps = {
  clientId: string;
  selectedScope:
    | PermissionScopeRepresentation
    | ScopeRepresentation
    | undefined;
  refresh: () => void;
  open: boolean;
  toggleDialog: () => void;
};

export const DeleteScopeDialog = ({
  clientId,
  selectedScope,
  refresh,
  open,
  toggleDialog,
}: DeleteScopeDialogProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  return (
    <ConfirmDialogModal
      open={open}
      toggleDialog={toggleDialog}
      titleKey="deleteScope"
      continueButtonLabel="confirm"
      onConfirm={async () => {
        try {
          await adminClient.clients.delAuthorizationScope({
            id: clientId,
            scopeId: selectedScope?.id!,
          });
          addAlert(t("resourceScopeSuccess"), AlertVariant.success);
          refresh();
        } catch (error) {
          addError("resourceScopeError", error);
        }
      }}
    >
      {t("deleteScopeConfirm")}
      {selectedScope &&
        "permissions" in selectedScope &&
        selectedScope.permissions &&
        selectedScope.permissions.length > 0 && (
          <Alert
            variant="warning"
            isInline
            isPlain
            title={t("deleteScopeWarning")}
            className="pf-v5-u-pt-lg"
          >
            <p className="pf-v5-u-pt-xs">
              {selectedScope.permissions.map((permission) => (
                <strong key={permission.id} className="pf-v5-u-pr-md">
                  {permission.name}
                </strong>
              ))}
            </p>
          </Alert>
        )}
    </ConfirmDialogModal>
  );
};
