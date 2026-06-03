/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/DefaultGroupsTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { KeycloakSpinner, useAlerts, useFetch, useHelp } from "../../../shared/keycloak-ui-shared";
import { Action, DataTable } from "@metronome/ui/components/table/data-table";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { Popover as UIPopover, PopoverContent as UIPopoverContent, PopoverTrigger as UIPopoverTrigger } from "@metronome/ui/components/popover";
import { cn } from "@metronome/ui/lib/utils";
import { DotsThreeVertical as EllipsisVIcon, Question as QuestionCircleIcon } from "@phosphor-icons/react"
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useConfirmDialog } from "../confirm-dialog/ConfirmDialog";
import { GroupPickerDialog } from "../group/GroupPickerDialog";
import { useAccess } from "../../context/access/access";
import { GroupResourceContext } from "../../context/group-resource/group-resource-context";
import { useRealm } from "../../context/realm-context/realm-context";
import { toUserFederation } from "../../lib/user-federation";
import useToggle from "../../utils/use-toggle";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
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
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

export const DefaultsGroupsTab = () => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();

  const [isKebabOpen, toggleKebab] = useToggle();
  const [isGroupPickerOpen, toggleGroupPicker] = useToggle();
  const [defaultGroups, setDefaultGroups] = useState<GroupRepresentation[]>();
  const [selectedRows, setSelectedRows] = useState<GroupRepresentation[]>([]);

  const [key, setKey] = useState(0);
  const [load, setLoad] = useState(0);
  const reload = () => setLoad(load + 1);

  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();
  const { enabled } = useHelp();

  const { hasAccess } = useAccess();
  const canAddOrRemoveGroups = hasAccess("view-users", "manage-realm");

  useFetch(
    () => adminClient.realms.getDefaultGroups({ realm }),
    (groups) => {
      setDefaultGroups(groups);
      setKey(key + 1);
    },
    [load],
  );

  const loader = () => Promise.resolve(defaultGroups!);

  const removeGroup = async () => {
    try {
      await Promise.all(
        selectedRows.map((group) =>
          adminClient.realms.removeDefaultGroup({
            realm,
            id: group.id!,
          }),
        ),
      );
      addAlert(
        t("groupRemove", { count: selectedRows.length }),
        AlertVariant.success,
      );
      setSelectedRows([]);
    } catch (error) {
      addError("groupRemoveError", error);
    }
    reload();
  };

  const addGroups = async (groups: GroupRepresentation[]) => {
    try {
      await Promise.all(
        groups.map((group) =>
          adminClient.realms.addDefaultGroup({
            realm,
            id: group.id!,
          }),
        ),
      );
      addAlert(
        t("defaultGroupAdded", { count: groups.length }),
        AlertVariant.success,
      );
    } catch (error) {
      addError("defaultGroupAddedError", error);
    }
    reload();
  };

  const [toggleRemoveDialog, RemoveDialog] = useConfirmDialog({
    titleKey: t("removeConfirmTitle", { count: selectedRows.length }),
    messageKey: t("removeConfirm", { count: selectedRows.length }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: removeGroup,
  });

  if (!defaultGroups) {
    return <KeycloakSpinner />;
  }

  return (
    <GroupResourceContext value={adminClient.groups}>
      <RemoveDialog />
      {isGroupPickerOpen && (
        <GroupPickerDialog
          type="selectMany"
          text={{
            title: "addDefaultGroups",
            ok: "add",
          }}
          onConfirm={async (groups) => {
            await addGroups(groups || []);
            toggleGroupPicker();
          }}
          onClose={toggleGroupPicker}
        />
      )}
      {enabled && (
        <Popover
          bodyContent={
            <Trans i18nKey="defaultGroupsHelp">
              {" "}
              <Link to={toUserFederation({ realm })} />.
            </Trans>
          }
        >
          <TextContent
            className="keycloak__section_intro__help"
            style={{
              paddingLeft: "var(--pf-v5-c-page__main-section--PaddingLeft)",
            }}
          >
            <Text>
              <QuestionCircleIcon /> {t("whatIsDefaultGroups")}
            </Text>
          </TextContent>
        </Popover>
      )}
      <DataTable
        t={t}
        key={key}
        canSelectAll
        onSelect={(rows) => setSelectedRows([...rows])}
        loader={loader}
        ariaLabelKey="defaultGroups"
        searchPlaceholderKey="searchForGroups"
        toolbarItem={
          canAddOrRemoveGroups && (
            <>
              <ToolbarItem>
                <Button
                  data-testid="openCreateGroupModal"
                  variant="primary"
                  onClick={toggleGroupPicker}
                >
                  {t("addGroups")}
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  onOpenChange={toggleKebab}
                  toggle={(ref) => (
                    <MenuToggle
                      ref={ref}
                      isExpanded={isKebabOpen}
                      variant="plain"
                      onClick={toggleKebab}
                      isDisabled={selectedRows!.length === 0}
                    >
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  isOpen={isKebabOpen}
                  shouldFocusToggleOnSelect
                >
                  <DropdownList>
                    <DropdownItem
                      key="action"
                      component="button"
                      onClick={() => {
                        toggleRemoveDialog();
                        toggleKebab();
                      }}
                    >
                      {t("remove")}
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </>
          )
        }
        actions={
          canAddOrRemoveGroups
            ? [
                {
                  title: t("remove"),
                  onRowClick: (group) => {
                    setSelectedRows([group]);
                    toggleRemoveDialog();
                    return Promise.resolve(false);
                  },
                } as Action<GroupRepresentation>,
              ]
            : []
        }
        columns={[
          {
            name: "name",
            displayKey: "groupName",
          },
          {
            name: "path",
            displayKey: "path",
          },
        ]}
        emptyState={
          <ListEmptyState
            hasIcon
            message={t("noDefaultGroups")}
            instructions={
              <Trans i18nKey="noDefaultGroupsInstructions">
                {" "}
                <Link
                  className="pf-v5-u-font-weight-light"
                  to={toUserFederation({ realm })}
                  role="navigation"
                  aria-label={t("identityBrokeringLink")}
                />
                Add groups...
              </Trans>
            }
            primaryActionText={canAddOrRemoveGroups ? t("addGroups") : ""}
            onPrimaryAction={toggleGroupPicker}
          />
        }
      />
    </GroupResourceContext>
  );
};
