/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/OrganizationModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { KeycloakDataTable } from "../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
const TableText = ({ children }: any) => (
  <span className="block truncate">{children}</span>
);
import { differenceBy } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../admin-client";


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

type OrganizationModalProps = {
  isJoin?: boolean;
  existingOrgs: OrganizationRepresentation[];
  onAdd: (orgs: OrganizationRepresentation[]) => Promise<void>;
  onClose: () => void;
};

export const OrganizationModal = ({
  isJoin = true,
  existingOrgs,
  onAdd,
  onClose,
}: OrganizationModalProps) => {
  const { adminClient } = useAdminClient();
  const { t } = useTranslation();

  const [selectedRows, setSelectedRows] = useState<UserRepresentation[]>([]);

  const loader = async (first?: number, max?: number, search?: string) => {
    const params = {
      first,
      search,
      max: max! + existingOrgs.length,
    };

    const orgs = await adminClient.organizations.find(params);
    return differenceBy(orgs, existingOrgs, "id");
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={isJoin ? t("joinOrganization") : t("sendInvitation")}
      isOpen
      onClose={onClose}
      actions={[
        <Button
          data-testid="join"
          key="confirm"
          variant="primary"
          onClick={async () => {
            await onAdd(selectedRows);
            onClose();
          }}
        >
          {isJoin ? t("join") : t("send")}
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
      <KeycloakDataTable
        loader={loader}
        isPaginated
        ariaLabelKey="organizationsList"
        searchPlaceholderKey="searchOrganization"
        canSelectAll
        onSelect={(rows) => setSelectedRows([...rows])}
        columns={[
          {
            name: "name",
            displayKey: "organizationName",
          },
          {
            name: "description",
            cellRenderer: (row) => (
              <TableText wrapModifier="truncate">{row.description}</TableText>
            ),
          },
        ]}
      />
    </Modal>
  );
};
