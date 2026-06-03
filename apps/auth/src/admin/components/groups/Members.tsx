/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/Members.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { SubGroupQuery } from "@keycloak/keycloak-admin-client/lib/resources/groups";
import { useAlerts, useFetch } from "../../../shared/keycloak-ui-shared";
import { Action, DataTable } from "@metronome/ui/components/data-table";
import { ListEmptyState } from "@metronome/ui/components/list-empty-state";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Checkbox as UICheckbox } from "@metronome/ui/components/checkbox";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { DotsThreeVertical as EllipsisVIcon, Info as InfoCircleIcon } from "@phosphor-icons/react"
import { uniqBy } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { KeycloakSpinner } from "../../../shared/keycloak-ui-shared";
import { useAccess } from "../../context/access/access";
import { useRealm } from "../../context/realm-context/realm-context";
import { toUser } from "../../lib/user";
import { emptyFormatter } from "../../util";
import { MemberModal } from "./MembersModal";
import { useSubGroups } from "./SubGroupsContext";
import { getLastId } from "./groupIdUtils";
import { MembershipsModal } from "./MembershipsModal";
import useToggle from "../../utils/use-toggle";
import { useGroupResource } from "../../context/group-resource/group-resource-context";


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
const Checkbox = ({ id, label, description, isChecked, isDisabled, onChange, name, ...props }: any) => (
  <div className="flex items-start gap-2">
    <UICheckbox id={id} name={name} checked={isChecked} disabled={isDisabled}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)} {...props} />
    {label ? (
      <label htmlFor={id} className="text-sm leading-tight">
        {label}
        {description ? <span className="block text-muted-foreground text-xs">{description}</span> : null}
      </label>
    ) : null}
  </div>
);
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
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);
const MenuToggle = React.forwardRef<HTMLButtonElement, any>(
  ({ children, isExpanded, onClick, isDisabled, variant, ...props }, ref) => (
    <UIButton ref={ref} variant="outline" onClick={onClick} disabled={isDisabled} aria-expanded={isExpanded} {...props}>
      {children}
    </UIButton>
  ),
);
(MenuToggle as any).displayName = "MenuToggle";
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

const UserDetailLink = (user: UserRepresentation) => {
  const { realm } = useRealm();
  const { t } = useTranslation();
  return (
    <Link key={user.id} to={toUser({ realm, id: user.id!, tab: "settings" })}>
      {user.username}{" "}
      {!user.enabled && (
        <Label color="red" icon={<InfoCircleIcon />}>
          {t("disabled")}
        </Label>
      )}
    </Link>
  );
};

export const Members = () => {
  const { adminClient } = useAdminClient();
  const groups = useGroupResource();
  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const location = useLocation();
  const id = getLastId(location.pathname);
  const [includeSubGroup, setIncludeSubGroup] = useState(false);
  const { currentGroup: group } = useSubGroups();
  const [currentGroup, setCurrentGroup] = useState<GroupRepresentation>();
  const [addMembers, setAddMembers] = useState(false);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<UserRepresentation[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRepresentation>();
  const [showMemberships, toggleShowMemberships] = useToggle();
  const { hasAccess } = useAccess();

  useFetch(() => groups.findOne({ id: group()!.id! }), setCurrentGroup, []);

  const isManager =
    hasAccess("manage-users") || currentGroup?.access!.manageMembership;

  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  // this queries the subgroups using the new search paradigm but doesn't
  // account for pagination and therefore isn't going to scale well
  const getSubGroups = async (groupId?: string, count = 0) => {
    let nestedGroups: GroupRepresentation[] = [];
    if (!count || !groupId) {
      return nestedGroups;
    }
    const args: SubGroupQuery = {
      parentId: groupId,
      first: 0,
      max: count,
    };
    const subGroups: GroupRepresentation[] = await groups.listSubGroups(args);
    nestedGroups = nestedGroups.concat(subGroups);

    await Promise.all(
      subGroups.map((g) => getSubGroups(g.id, g.subGroupCount)),
    ).then((values: GroupRepresentation[][]) => {
      values.forEach((groups) => (nestedGroups = nestedGroups.concat(groups)));
    });
    return nestedGroups;
  };

  const loader = async (first?: number, max?: number) => {
    if (!id) {
      return [];
    }

    let members = await groups.listMembers({
      id: id!,
      briefRepresentation: true,
      first,
      max,
    });

    if (includeSubGroup && currentGroup?.subGroupCount && currentGroup.id) {
      const subGroups = await getSubGroups(
        currentGroup.id,
        currentGroup.subGroupCount,
      );
      await Promise.all(
        subGroups.map((g) =>
          groups.listMembers({
            id: g.id!,
            briefRepresentation: true,
          }),
        ),
      ).then((values: UserRepresentation[][]) => {
        values.forEach((users) => (members = members.concat(users)));
      });
      members = uniqBy(members, (member) => member.username);
    }

    return members;
  };

  if (!currentGroup) {
    return <KeycloakSpinner />;
  }

  return (
    <>
      {addMembers && (
        <MemberModal
          membersQuery={(first, max) =>
            groups.listMembers({ id: id!, first, max })
          }
          orgId={groups.getOrgId()}
          onAdd={async (selectedRows) => {
            try {
              await Promise.all(
                selectedRows.map(async (user) => {
                  if (!groups.isOrgGroups()) {
                    await adminClient.users.addToGroup({
                      id: user.id!,
                      groupId: id!,
                    });
                  } else {
                    await groups.addMemberToOrgGroup({
                      groupId: id!,
                      userId: user.id!,
                    });
                  }
                }),
              );
              addAlert(t("usersAdded", { count: selectedRows.length }));
            } catch (error) {
              addError("usersAddedError", error);
            }
          }}
          onClose={() => {
            setAddMembers(false);
            refresh();
          }}
        />
      )}
      {showMemberships && (
        <MembershipsModal
          onClose={() => {
            toggleShowMemberships();
          }}
          user={selectedUser!}
          orgId={groups.getOrgId()}
        />
      )}
      <DataTable
        t={t}
        data-testid="members-table"
        key={`${id}${key}${includeSubGroup}`}
        loader={loader}
        ariaLabelKey="members"
        isPaginated
        canSelectAll
        onSelect={(rows) => setSelectedRows([...rows])}
        toolbarItem={
          isManager && (
            <>
              <ToolbarItem>
                <Button
                  data-testid="addMember"
                  variant="primary"
                  onClick={() => setAddMembers(true)}
                >
                  {t("addMember")}
                </Button>
              </ToolbarItem>
              {!groups.isOrgGroups() && (
                <ToolbarItem>
                  <Checkbox
                    data-testid="includeSubGroupsCheck"
                    label={t("includeSubGroups")}
                    id="kc-include-sub-groups"
                    isChecked={includeSubGroup}
                    onChange={() => setIncludeSubGroup(!includeSubGroup)}
                  />
                </ToolbarItem>
              )}
              <ToolbarItem>
                <Dropdown
                  onOpenChange={(isOpen) => setIsKebabOpen(isOpen)}
                  toggle={(ref) => (
                    <MenuToggle
                      data-testid="kebab"
                      ref={ref}
                      variant="plain"
                      onClick={() => setIsKebabOpen(!isKebabOpen)}
                      isExpanded={isKebabOpen}
                      isDisabled={selectedRows.length === 0}
                      aria-label="Actions"
                    >
                      <EllipsisVIcon />
                    </MenuToggle>
                  )}
                  shouldFocusToggleOnSelect
                  isOpen={isKebabOpen}
                >
                  <DropdownList>
                    <DropdownItem
                      key="action"
                      component="button"
                      onClick={async () => {
                        try {
                          await Promise.all(
                            selectedRows.map(async (user) => {
                              if (!groups.isOrgGroups()) {
                                await adminClient.users.delFromGroup({
                                  id: user.id!,
                                  groupId: id!,
                                });
                              } else {
                                await groups.removeMemberFromOrgGroup({
                                  groupId: id!,
                                  userId: user.id!,
                                });
                              }
                            }),
                          );
                          setIsKebabOpen(false);
                          addAlert(
                            t("usersLeft", { count: selectedRows.length }),
                          );
                        } catch (error) {
                          addError("usersLeftError", error);
                        }

                        refresh();
                      }}
                    >
                      {t("leave")}
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
            </>
          )
        }
        actions={[
          ...(isManager
            ? [
                {
                  title: t("leave"),
                  onRowClick: async (user) => {
                    try {
                      if (!groups.isOrgGroups()) {
                        await adminClient.users.delFromGroup({
                          id: user.id!,
                          groupId: id!,
                        });
                      } else {
                        await groups.removeMemberFromOrgGroup({
                          groupId: id!,
                          userId: user.id!,
                        });
                      }
                      addAlert(t("usersLeft", { count: 1 }));
                    } catch (error) {
                      addError("usersLeftError", error);
                    }
                    return true;
                  },
                } as Action<UserRepresentation>,
              ]
            : []),
          {
            title: t("showMemberships"),
            onRowClick: (user) => {
              setSelectedUser(user);
              toggleShowMemberships();
            },
          } as Action<UserRepresentation>,
        ]}
        columns={[
          {
            name: "username",
            displayKey: "name",
            cellRenderer: UserDetailLink,
          },
          {
            name: "email",
            displayKey: "email",
            cellFormatters: [emptyFormatter()],
          },
          {
            name: "firstName",
            displayKey: "firstName",
            cellFormatters: [emptyFormatter()],
          },
          {
            name: "lastName",
            displayKey: "lastName",
            cellFormatters: [emptyFormatter()],
          },
        ]}
        emptyState={
          <ListEmptyState
            message={t("noUsersFound")}
            instructions={isManager ? t("emptyInstructions") : undefined}
            primaryActionText={isManager ? t("addMember") : undefined}
            onPrimaryAction={() => setAddMembers(true)}
            secondaryActions={
              !groups.isOrgGroups()
                ? [
                    {
                      text: t("includeSubGroups"),
                      onClick: () => setIncludeSubGroup(true),
                    },
                  ]
                : []
            }
          />
        }
      />
    </>
  );
};
