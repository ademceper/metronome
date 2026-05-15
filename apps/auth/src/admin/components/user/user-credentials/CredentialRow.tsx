/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/user-credentials/CredentialRow.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  TableCell as Td,
} from "@metronome/ui/components/table";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import type CredentialRepresentation from "@keycloak/keycloak-admin-client/lib/defs/credentialRepresentation";
import useToggle from "../../../utils/useToggle";
import useLocaleSort from "../../../utils/useLocaleSort";
import { CredentialDataDialog } from "./CredentialDataDialog";
import useFormatDate from "../../../utils/useFormatDate";
import { DotsThreeVertical as EllipsisVIcon } from "@phosphor-icons/react"


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
const Dropdown = ({ toggle, isOpen, onSelect, onOpenChange, popperProps, children, ...props }: any) => {
  const trigger = typeof toggle === "function" ? toggle((node: HTMLElement | null) => node) : toggle;
  return (
    <UIDropdownMenu open={isOpen} onOpenChange={(open: boolean) => onOpenChange?.(open)}>
      <UIDropdownMenuTrigger asChild>{trigger}</UIDropdownMenuTrigger>
      <UIDropdownMenuContent>{children}</UIDropdownMenuContent>
    </UIDropdownMenu>
  );
};
const DropdownItem = ({ onClick, isDisabled, isAriaDisabled, description, children, ...props }: any) => (
  <UIDropdownMenuItem onClick={onClick} disabled={isDisabled ?? isAriaDisabled} {...props}>
    {children}
    {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
  </UIDropdownMenuItem>
);
const DropdownList = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>{children}</div>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";

type CredentialRowProps = {
  credential: CredentialRepresentation;
  resetPassword: () => void;
  toggleDelete: () => void;
  children: ReactNode;
};

export const CredentialRow = ({
  credential,
  resetPassword,
  toggleDelete,
  children,
}: CredentialRowProps) => {
  const formatDate = useFormatDate();
  const { t } = useTranslation();
  const [showData, toggleShow] = useToggle();
  const [kebabOpen, toggleKebab] = useToggle();
  const localeSort = useLocaleSort();

  const rows = useMemo(() => {
    if (!credential.credentialData) {
      return [];
    }

    const credentialData: Record<string, unknown> = JSON.parse(
      credential.credentialData,
    );
    return localeSort(Object.entries(credentialData), ([key]) => key).map<
      [string, string]
    >(([key, value]) => {
      if (typeof value === "string") {
        return [key, value];
      }

      return [key, JSON.stringify(value)];
    });
  }, [credential.credentialData]);

  return (
    <>
      {showData && Object.keys(credential).length !== 0 && (
        <CredentialDataDialog
          title={credential.userLabel || t("passwordDataTitle")}
          credentialData={rows}
          onClose={() => {
            toggleShow();
          }}
        />
      )}

      <Td>{children}</Td>
      <Td>{formatDate(new Date(credential.createdDate!))}</Td>
      <Td>
        <Button
          className="kc-showData-btn"
          variant="link"
          data-testid="showDataBtn"
          onClick={toggleShow}
        >
          {t("showDataBtn")}
        </Button>
      </Td>
      {credential.type === "password" ? (
        <Td isActionCell>
          <Button
            variant="secondary"
            data-testid="resetPasswordBtn"
            onClick={resetPassword}
          >
            {t("resetPasswordBtn")}
          </Button>
        </Td>
      ) : (
        <Td />
      )}
      <Td isActionCell>
        <Dropdown
          popperProps={{
            position: "right",
          }}
          onOpenChange={toggleKebab}
          toggle={(ref) => (
            <MenuToggle
              ref={ref}
              isExpanded={kebabOpen}
              onClick={toggleKebab}
              variant="plain"
              aria-label="Kebab toggle"
            >
              <EllipsisVIcon />
            </MenuToggle>
          )}
          isOpen={kebabOpen}
        >
          <DropdownList>
            <DropdownItem
              key={credential.id}
              data-testid="deleteDropdownItem"
              component="button"
              onClick={() => {
                toggleDelete();
                toggleKebab();
              }}
            >
              {t("deleteBtn")}
            </DropdownItem>
          </DropdownList>
        </Dropdown>
      </Td>
    </>
  );
};
