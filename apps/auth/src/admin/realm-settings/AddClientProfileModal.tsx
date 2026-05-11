/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/AddClientProfileModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ClientProfileRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfileRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { KeycloakDataTable, useFetch } from "../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../admin-client";
import { KeycloakSpinner } from "../../shared/keycloak-ui-shared";
import { ListEmptyState } from "../../shared/keycloak-ui-shared";
import { translationFormatter } from "../utils/translationFormatter";


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
const Button = ({
  variant, isDisabled, isLoading, isInline, isBlock, isSmall, isLarge,
  isAriaDisabled, isDanger, spinnerAriaValueText, countOptions,
  icon, iconPosition, component, to, href, target, rel, children, ...props
}: any) => {
  const v = (ButtonVariant as any)[variant] ?? (typeof variant === "string" ? variant : "default");
  if (href || to) {
    return (
      <a href={href || to} target={target} rel={rel}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm", (props as any).className)} {...props}>
        {icon && iconPosition !== "right" ? icon : null}
        {children}
        {icon && iconPosition === "right" ? icon : null}
      </a>
    );
  }
  return (
    <UIButton variant={v as any} disabled={isDisabled ?? (props as any).disabled} {...props}>
      {icon && iconPosition !== "right" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </UIButton>
  );
};
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);
const Modal = ({ isOpen, onClose, title, description, variant, actions, header, footer, children, ...props }: any) => (
  <UIDialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()}>
    <UIDialogContent {...props}>
      {(title || header) ? (
        <UIDialogHeader>
          {title ? <UIDialogTitle>{title}</UIDialogTitle> : null}
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
          {header}
        </UIDialogHeader>
      ) : null}
      {children}
      {(actions || footer) ? (
        <UIDialogFooter>
          {actions}
          {footer}
        </UIDialogFooter>
      ) : null}
    </UIDialogContent>
  </UIDialog>
);
const ModalVariant = {
  small: "small",
  medium: "medium",
  large: "large",
  default: "default",
} as const;

type ClientProfile = ClientProfileRepresentation & {
  global: boolean;
};

const AliasRenderer = ({ name, global }: ClientProfile) => {
  const { t } = useTranslation();

  return (
    <>
      {name} {global && <Label color="blue">{t("global")}</Label>}
    </>
  );
};

export type AddClientProfileModalProps = {
  open: boolean;
  toggleDialog: () => void;
  onConfirm: (newReps: RoleRepresentation[]) => void;
  allProfiles: string[];
};

export const AddClientProfileModal = (props: AddClientProfileModalProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);

  const [tableProfiles, setTableProfiles] = useState<ClientProfile[]>();

  useFetch(
    () =>
      adminClient.clientPolicies.listProfiles({
        includeGlobalProfiles: true,
      }),
    (allProfiles) => {
      const globalProfiles = allProfiles.globalProfiles?.map(
        (globalProfiles) => ({
          id: globalProfiles.name,
          ...globalProfiles,
          global: true,
        }),
      );

      const profiles = allProfiles.profiles?.map((profiles) => ({
        ...profiles,
        global: false,
      }));

      setTableProfiles([...(globalProfiles ?? []), ...(profiles ?? [])]);
    },
    [],
  );

  const loader = async () =>
    tableProfiles?.filter((item) => !props.allProfiles.includes(item.name!)) ??
    [];

  if (!tableProfiles) {
    return <KeycloakSpinner />;
  }

  return (
    <Modal
      data-testid="addClientProfile"
      title={t("addClientProfile")}
      isOpen={props.open}
      onClose={props.toggleDialog}
      variant={ModalVariant.large}
      actions={[
        <Button
          key="add"
          data-testid="add-client-profile-button"
          variant="primary"
          isDisabled={!selectedRows.length}
          onClick={() => {
            props.toggleDialog();
            props.onConfirm(selectedRows);
          }}
        >
          {t("add")}
        </Button>,
        <Button
          key="cancel"
          variant="link"
          onClick={() => {
            props.toggleDialog();
          }}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <KeycloakDataTable
        loader={loader}
        ariaLabelKey="profilesList"
        searchPlaceholderKey="searchProfile"
        canSelectAll
        onSelect={(rows) => {
          setSelectedRows([...rows]);
        }}
        columns={[
          {
            name: "name",
            displayKey: "clientProfileName",
            cellRenderer: AliasRenderer,
          },
          {
            name: "description",
            cellFormatters: [translationFormatter(t)],
          },
        ]}
        emptyState={
          <ListEmptyState
            hasIcon
            message={t("noRoles")}
            instructions={t("noRolesInstructions")}
            primaryActionText={t("createRole")}
          />
        }
      />
    </Modal>
  );
};
