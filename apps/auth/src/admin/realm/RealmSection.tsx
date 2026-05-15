/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm/RealmSection.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import { NetworkError } from "@keycloak/keycloak-admin-client";
import { KeycloakDataTable, useAlerts } from "../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { Popover as UIPopover, PopoverContent as UIPopoverContent, PopoverTrigger as UIPopoverTrigger } from "@metronome/ui/components/popover";
import { cn } from "@metronome/ui/lib/utils";
import { DotsThreeVertical as EllipsisVIcon } from "@phosphor-icons/react"
const cellWidth = (_n: number) => () => ({ className: '' });
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../admin-client";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { fetchAdminUI } from "../context/auth/admin-ui-endpoint";
import { useRealm } from "../context/realm-context/RealmContext";
import { useRecentRealms } from "../context/RecentRealms";
import { useWhoAmI } from "../context/whoami/WhoAmI";
import { translationFormatter } from "../utils/translationFormatter";
import NewRealmForm from "./add/NewRealmForm";
import { toRealm } from "../lib/realm";
import { toDashboard } from "../lib/dashboard";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
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
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
const Popover = ({ bodyContent, headerContent, footerContent, children, position, ...props }: any) => (
  <UIPopover {...props}>
    <UIPopoverTrigger asChild>{children}</UIPopoverTrigger>
    <UIPopoverContent>
      {headerContent ? (
        <div className="font-medium text-sm">{typeof headerContent === "function" ? headerContent() : headerContent}</div>
      ) : null}
      {bodyContent ? (
        <div className="text-sm">{typeof bodyContent === "function" ? bodyContent() : bodyContent}</div>
      ) : null}
      {footerContent ? (
        <div className="pt-2 text-sm">{typeof footerContent === "function" ? footerContent() : footerContent}</div>
      ) : null}
    </UIPopoverContent>
  </UIPopover>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

export type RealmNameRepresentation = {
  name: string;
  displayName?: string;
};

const RecentRealmsDropdown = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const recentRealms = useRecentRealms();

  if (recentRealms.length < 3) return null;
  return (
    <Dropdown
      shouldFocusToggleOnSelect
      onOpenChange={(isOpen) => setOpen(isOpen)}
      toggle={(ref) => (
        <MenuToggle
          data-testid="kebab"
          aria-label="Kebab toggle"
          ref={ref}
          onClick={() => setOpen(!open)}
        >
          {t("recentRealms")}
        </MenuToggle>
      )}
      isOpen={open}
    >
      <DropdownList>
        {recentRealms.map(({ name }) => (
          <DropdownItem
            key="server info"
            component={(props) => (
              <Link {...props} to={toDashboard({ realm: name })} />
            )}
          >
            {name}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};

type KebabDropdownProps = {
  onClick: () => void;
  isDisabled?: boolean;
};

const KebabDropdown = ({ onClick, isDisabled }: KebabDropdownProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <Dropdown
      shouldFocusToggleOnSelect
      onOpenChange={(isOpen) => setOpen(isOpen)}
      toggle={(ref) => (
        <MenuToggle
          data-testid="kebab"
          aria-label="Kebab toggle"
          ref={ref}
          onClick={() => setOpen(!open)}
          variant="plain"
          isDisabled={isDisabled}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
      isOpen={open}
    >
      <DropdownList>
        <DropdownItem
          data-testid="delete"
          onClick={() => {
            setOpen(false);
            onClick();
          }}
        >
          {t("delete")}
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

type RealmRow = RealmNameRepresentation & { id: string };

export default function RealmSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { whoAmI } = useWhoAmI();
  const { realm } = useRealm();
  const { adminClient } = useAdminClient();
  const { addAlert, addError } = useAlerts();

  const [selected, setSelected] = useState<RealmRow[]>([]);
  const [openNewRealm, setOpenNewRealm] = useState(false);
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const loader = async (first?: number, max?: number, search?: string) => {
    try {
      const result = await fetchAdminUI<RealmNameRepresentation[]>(
        adminClient,
        "ui-ext/realms/names",
        { first: `${first}`, max: `${max}`, search: search || "" },
      );
      return result.map((r) => ({ ...r, id: r.name }));
    } catch (error) {
      if (error instanceof NetworkError && error.response.status < 500) {
        return [];
      }

      throw error;
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteConfirmRealm", {
      count: selected.length,
      name: selected[0]?.name,
    }),
    messageKey: "deleteConfirmRealmSetting",
    continueButtonLabel: "delete",
    onConfirm: async () => {
      try {
        if (selected.filter(({ name }) => name === "master").length > 0) {
          addAlert(t("cantDeleteMasterRealm"), AlertVariant.warning);
        }
        const filtered = selected.filter(({ name }) => name !== "master");
        if (filtered.length === 0) return;
        await Promise.all(
          filtered.map(({ name: realmName }) =>
            adminClient.realms.del({ realm: realmName }),
          ),
        );
        addAlert(t("deletedSuccessRealmSetting"));
        if (selected.filter(({ name }) => name === realm).length > 0) {
          navigate(toRealm({ realm: "master" }));
        }
        refresh();
        setSelected([]);
      } catch (error) {
        addError("deleteError", error);
      }
    },
  });

  return (
    <>
      <DeleteConfirm />
      {openNewRealm && (
        <NewRealmForm
          onClose={() => {
            setOpenNewRealm(false);
            refresh();
          }}
        />
      )}
      <ViewHeader titleKey="manageRealms" divider={false} />
      <PageSection variant="light" className="pf-v5-u-p-0">
        <KeycloakDataTable
          key={key}
          loader={loader}
          isPaginated
          onSelect={setSelected}
          canSelectAll
          ariaLabelKey="selectRealm"
          searchPlaceholderKey="search"
          actions={[
            {
              title: t("delete"),
              onRowClick: (selected) => {
                setSelected([selected]);
                toggleDeleteDialog();
              },
            },
          ]}
          toolbarItem={
            <>
              <ToolbarItem>
                {whoAmI.createRealm && (
                  <Button
                    onClick={() => setOpenNewRealm(true)}
                    data-testid="add-realm"
                  >
                    {t("createRealm")}
                  </Button>
                )}
              </ToolbarItem>
              <ToolbarItem>
                <RecentRealmsDropdown />
              </ToolbarItem>
              <ToolbarItem>
                <KebabDropdown
                  onClick={toggleDeleteDialog}
                  isDisabled={selected.length === 0}
                />
              </ToolbarItem>
            </>
          }
          columns={[
            {
              name: "name",
              transforms: [cellWidth(20)],
              cellRenderer: ({ name }) =>
                name !== realm ? (
                  <Link to={toDashboard({ realm: name })}>{name}</Link>
                ) : (
                  <Popover
                    bodyContent={t("currentRealmExplain")}
                    triggerAction="hover"
                  >
                    <>
                      {name} <Badge isRead>{t("currentRealm")}</Badge>
                    </>
                  </Popover>
                ),
            },
            {
              name: "displayName",
              transforms: [cellWidth(80)],
              cellFormatters: [translationFormatter(t)],
            },
          ]}
        />
      </PageSection>
    </>
  );
}
