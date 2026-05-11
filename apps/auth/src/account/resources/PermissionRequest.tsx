/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/PermissionRequest.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription as UIDialogDescription, DialogFooter as UIDialogFooter, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@metronome/ui/components/dialog";
import { cn } from "@metronome/ui/lib/utils";
import { UserCheck as UserCheckIcon } from "@phosphor-icons/react"
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { fetchPermission, updateRequest } from "../api";
import { Permission, Resource } from "../api/representations";
import { useAccountAlerts } from "../utils/useAccountAlerts";


const Badge = ({ isRead, ...props }: any) => <UIBadge {...props} />;
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
const Chip = ({ onClick, children, ...props }: any) => (
  <UIBadge variant="secondary" {...props}>
    {children}
    {onClick ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </UIBadge>
);
const Icon = ({ size, status, children, className, ...props }: any) => (
  <span className={cn("inline-flex items-center justify-center", className)} {...props}>{children}</span>
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
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);

type PermissionRequestProps = {
  resource: Resource;
  refresh: () => void;
};

export const PermissionRequest = ({
  resource,
  refresh,
}: PermissionRequestProps) => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const approveDeny = async (
    shareRequest: Permission,
    approve: boolean = false,
  ) => {
    try {
      const permissions = await fetchPermission({ context }, resource._id);
      const { scopes, username } = permissions.find(
        (p) => p.username === shareRequest.username,
      ) || { scopes: [], username: shareRequest.username };

      await updateRequest(
        context,
        resource._id,
        username,
        approve
          ? [...(scopes as string[]), ...(shareRequest.scopes as string[])]
          : scopes,
      );
      addAlert(t("shareSuccess"));
      toggle();
      refresh();
    } catch (error) {
      addError("shareError", error);
    }
  };

  return (
    <>
      <Button variant="link" onClick={toggle}>
        <Icon size="lg">
          <UserCheckIcon />
        </Icon>
        <Badge>{resource.shareRequests?.length}</Badge>
      </Button>
      <Modal
        title={t("permissionRequest", { name: resource.name })}
        variant={ModalVariant.large}
        isOpen={open}
        onClose={toggle}
        actions={[
          <Button key="close" variant="link" onClick={toggle}>
            {t("close")}
          </Button>,
        ]}
      >
        <Table aria-label={t("resources")}>
          <Thead>
            <Tr>
              <Th>{t("requestor")}</Th>
              <Th>{t("permissionRequests")}</Th>
              <Th aria-hidden="true"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {resource.shareRequests?.map((shareRequest) => (
              <Tr key={shareRequest.username}>
                <Td>
                  {shareRequest.firstName} {shareRequest.lastName}{" "}
                  {shareRequest.lastName ? "" : shareRequest.username}
                  <br />
                  <Text component="small">{shareRequest.email}</Text>
                </Td>
                <Td>
                  {shareRequest.scopes.map((scope) => (
                    <Chip key={scope.toString()} isReadOnly>
                      {scope as string}
                    </Chip>
                  ))}
                </Td>
                <Td>
                  <Button
                    onClick={async () => {
                      await approveDeny(shareRequest, true);
                    }}
                  >
                    {t("accept")}
                  </Button>
                  <Button
                    onClick={async () => {
                      await approveDeny(shareRequest);
                    }}
                    className="pf-v5-u-ml-sm"
                    variant="danger"
                  >
                    {t("deny")}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Modal>
    </>
  );
};
