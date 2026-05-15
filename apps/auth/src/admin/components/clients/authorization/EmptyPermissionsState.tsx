/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/authorization/EmptyPermissionsState.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { PlusCircle as PlusCircleIcon } from "@phosphor-icons/react"

import { PermissionType, toNewPermission } from "../../../lib/clients";
import { useRealm } from "../../../context/realm-context/RealmContext";
import { toUpperCase } from "../../../util";


const EmptyState = ({ variant, titleText, headingLevel, icon, children, ...props }: any) => (
  <div className={cn("flex flex-col items-center gap-3 py-10 text-center", (props as any).className)} {...props}>
    {icon ? <div className="text-muted-foreground">{React.createElement(icon)}</div> : null}
    {titleText ? <h3 className="font-medium text-lg">{titleText}</h3> : null}
    {children}
  </div>
);
const EmptyStateIcon = ({ icon, ...props }: any) => icon ? React.createElement(icon, { ...props }) : null;
const EmptyStateBody = ({ children, className, ...props }: any) => (
  <div className={cn("text-muted-foreground text-sm", className)} {...props}>{children}</div>
);
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
const Tooltip = ({ content, children, ...props }: any) => <>{children}</>;
const EmptyStateHeader = ({ titleText, headingLevel = "h4", icon, children, ...props }: any) => (
  <div className="flex flex-col items-center gap-2" {...props}>
    {icon}
    {titleText ? React.createElement(headingLevel, { className: "font-medium text-base" }, titleText) : null}
    {children}
  </div>
);
const EmptyStateFooter = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col items-center gap-2", className)} {...props}>{children}</div>
);

type EmptyButtonProps = {
  permissionType: PermissionType;
  disabled?: boolean;
  clientId: string;
};

const EmptyButton = ({
  permissionType,
  disabled = false,
  clientId,
}: EmptyButtonProps) => {
  const { t } = useTranslation();
  const { realm } = useRealm();
  const navigate = useNavigate();
  return (
    <Button
      data-testid={`create-${permissionType}`}
      className={
        disabled ? "keycloak__permissions__empty_state " : "pf-v5-u-m-sm"
      }
      variant="secondary"
      onClick={() =>
        !disabled &&
        navigate(toNewPermission({ realm, id: clientId, permissionType }))
      }
    >
      {t(`create${toUpperCase(permissionType)}BasedPermission`)}
    </Button>
  );
};

const TooltipEmptyButton = ({
  permissionType,
  disabled,
  ...props
}: EmptyButtonProps) => {
  const { t } = useTranslation();
  return disabled ? (
    <Tooltip content={t(`no${toUpperCase(permissionType)}CreateHint`)}>
      <EmptyButton
        {...props}
        disabled={disabled}
        permissionType={permissionType}
      />
    </Tooltip>
  ) : (
    <EmptyButton
      {...props}
      disabled={disabled}
      permissionType={permissionType}
    />
  );
};

type EmptyPermissionsStateProps = {
  clientId: string;
  isResourceEnabled?: boolean;
  isScopeEnabled?: boolean;
};

export const EmptyPermissionsState = ({
  clientId,
  isResourceEnabled,
  isScopeEnabled,
}: EmptyPermissionsStateProps) => {
  const { t } = useTranslation();
  return (
    <EmptyState data-testid="empty-state" variant="lg">
      <EmptyStateHeader
        titleText={<>{t("emptyPermissions")}</>}
        icon={<EmptyStateIcon icon={PlusCircleIcon} />}
        headingLevel="h1"
      />
      <EmptyStateBody>{t("emptyPermissionInstructions")}</EmptyStateBody>
      <EmptyStateFooter>
        <TooltipEmptyButton
          permissionType="resource"
          disabled={isResourceEnabled}
          clientId={clientId}
        />
        <br />
        <TooltipEmptyButton
          permissionType="scope"
          disabled={isScopeEnabled}
          clientId={clientId}
        />
      </EmptyStateFooter>
    </EmptyState>
  );
};
