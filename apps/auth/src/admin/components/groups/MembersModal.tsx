/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/MembersModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { Info as InfoCircleIcon } from "@phosphor-icons/react"
import { differenceBy } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { ListEmptyState } from "@metronome/ui/components/list-empty-state";
import { DataTable } from "@metronome/ui/components/data-table";
import { emptyFormatter } from "../../util";


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
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);

type MemberModalProps = {
  membersQuery: (first?: number, max?: number) => Promise<UserRepresentation[]>;
  onAdd: (users: UserRepresentation[]) => Promise<void>;
  onClose: () => void;
  orgId?: string;
  titleKey?: string;
  confirmLabelKey?: string;
  filterEmptyEmail?: boolean;
};

const UserDetail = (user: UserRepresentation) => {
  const { t } = useTranslation();
  return (
    <>
      {user.username}{" "}
      {!user.enabled && (
        <Label color="red" icon={<InfoCircleIcon />}>
          {t("disabled")}
        </Label>
      )}
    </>
  );
};

export const MemberModal = ({
  membersQuery,
  onAdd,
  onClose,
  orgId,
  titleKey = "addMember",
  confirmLabelKey = "add",
  filterEmptyEmail = false,
}: MemberModalProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addError } = useAlerts();
  const [selectedRows, setSelectedRows] = useState<UserRepresentation[]>([]);

  const loader = async (first?: number, max?: number, search?: string) => {
    const members = await membersQuery(first, max);
    const params: { [name: string]: string | number } = {
      first: first!,
      max: max! + members.length,
      search: search || "",
    };

    const usersQuery = orgId
      ? async (params: { [name: string]: string | number }) => {
          return await adminClient.organizations.listMembers({
            orgId,
            ...params,
          });
        }
      : async (params: { [name: string]: string | number }) => {
          return await adminClient.users.find({ ...params });
        };

    try {
      const users = await usersQuery(params);
      const filtered = differenceBy(users, members, "id");
      return (
        filterEmptyEmail ? filtered.filter((u) => u.email) : filtered
      ).slice(0, max);
    } catch (error) {
      addError("noUsersFoundError", error);
      return [];
    }
  };

  return (
    <Modal
      variant={ModalVariant.large}
      title={t(titleKey)}
      isOpen
      onClose={onClose}
      actions={[
        <Button
          data-testid="add"
          key="confirm"
          variant="primary"
          onClick={async () => {
            await onAdd(selectedRows);
            onClose();
          }}
        >
          {t(confirmLabelKey)}
        </Button>,
        <Button
          data-testid="cancel"
          key="cancel"
          variant="link"
          onClick={onClose}
        >
          {t("cancel")}
        </Button>,
      ]}
    >
      <DataTable
        t={t}
        loader={loader}
        isPaginated
        ariaLabelKey="titleUsers"
        searchPlaceholderKey="searchForUser"
        canSelectAll
        onSelect={(rows) => setSelectedRows([...rows])}
        emptyState={
          <ListEmptyState
            message={t("noUsersFound")}
            instructions={t("emptyInstructions")}
          />
        }
        columns={[
          {
            name: "username",
            displayKey: "username",
            cellRenderer: UserDetail,
          },
          {
            name: "email",
            displayKey: "email",
            cellFormatters: [emptyFormatter()],
          },
          {
            name: "lastName",
            displayKey: "lastName",
            cellFormatters: [emptyFormatter()],
          },
          {
            name: "firstName",
            displayKey: "firstName",
            cellFormatters: [emptyFormatter()],
          },
        ]}
      />
    </Modal>
  );
};
