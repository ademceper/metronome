/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/Invitations.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type { OrganizationInvitationRepresentation } from "@keycloak/keycloak-admin-client";
import { OrganizationInvitationStatus } from "@keycloak/keycloak-admin-client";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { DropdownMenu as UIDropdownMenu, DropdownMenuContent as UIDropdownMenuContent, DropdownMenuItem as UIDropdownMenuItem, DropdownMenuTrigger as UIDropdownMenuTrigger } from "@metronome/ui/components/dropdown-menu";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { CheckboxFilterComponent } from "../dynamic/checkbox-filter-component";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { DataTable } from "@metronome/ui/components/table/data-table";
import { useParams } from "../../utils/use-params";
import useToggle from "../../utils/use-toggle";
import { InviteMemberModal } from "./invite-member-modal";
import { MemberModal } from "../groups/members-modal";
import { EditOrganizationParams } from "../../lib/organizations";
import { SearchInputComponent } from "../dynamic/search-input-component";
import { useConfirmDialog } from "../confirm-dialog/confirm-dialog";
import useFormatDate from "../../utils/use-format-date";


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
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

const InvitationStatusBadge = ({
  status,
}: {
  status?: OrganizationInvitationStatus;
}) => {
  const { t } = useTranslation();

  return (
    <Chip isReadOnly>
      {status ? t(`organizationInvitationStatus.${status.toLowerCase()}`) : ""}
    </Chip>
  );
};

const DateCell = ({ date }: { date?: number }) => {
  const formatDate = useFormatDate();

  if (!date) {
    return <span>-</span>;
  }

  try {
    return <span>{formatDate(new Date(date * 1000))}</span>;
  } catch {
    return <span>{date}</span>;
  }
};

export const Invitations = () => {
  const { t } = useTranslation();
  const { adminClient } = useAdminClient();
  const { id: orgId } = useParams<EditOrganizationParams>();
  const { addAlert, addError } = useAlerts();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);
  const [openInviteMembers, toggleInviteMembers] = useToggle();
  const [openInviteRealmUser, toggleInviteRealmUser] = useToggle();
  const [isInviteMenuOpen, setIsInviteMenuOpen] = useState(false);
  const [selectedInvitations, setSelectedInvitations] = useState<
    OrganizationInvitationRepresentation[]
  >([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchTriggerText, setSearchTriggerText] = useState<string>("");
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>([]);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);

  const statusOptions = Object.values(OrganizationInvitationStatus).map(
    (status: string) => ({
      value: status,
      label: t(`organizationInvitationStatus.${status.toLowerCase()}`),
    }),
  );

  const loader = async (first?: number, max?: number) => {
    try {
      const invitations: OrganizationInvitationRepresentation[] =
        await adminClient.organizations.listInvitations({
          orgId,
          first,
          max,
          search: searchTriggerText,
          status:
            filteredStatuses.length === 1 ? filteredStatuses[0] : undefined,
        });

      return invitations;
    } catch (error) {
      addError("organizationsInvitationsListError", error);
      return [];
    }
  };

  const handleSearch = () => {
    setSearchTriggerText(searchText);
    refresh();
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchTriggerText("");
    refresh();
  };

  const resendInvitation = async (
    invitation: OrganizationInvitationRepresentation,
  ) => {
    try {
      await adminClient.organizations.resendInvitation({
        orgId,
        invitationId: invitation.id!,
      });
      addAlert(t("organizationInvitationResent"));
      refresh();
    } catch (error) {
      addError("organizationInvitationResendError", error);
    }
  };

  const deleteInvitations = async (
    invitations: OrganizationInvitationRepresentation[],
  ) => {
    try {
      await Promise.all(
        invitations.map((invitation) =>
          adminClient.organizations.deleteInvitation({
            orgId,
            invitationId: invitation.id!,
          }),
        ),
      );
      addAlert(
        t("organizationInvitationsDeleted", { count: invitations.length }),
      );
      refresh();
    } catch (error) {
      addError("organizationInvitationsDeleteError", error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "organizationInvitationsDeleteConfirmTitle",
    messageKey: "organizationInvitationsDeleteConfirm",
    continueButtonLabel: "delete",
    onConfirm: () => deleteInvitations(selectedInvitations),
  });

  const onStatusFilterSelect = (
    _event: React.MouseEvent<HTMLButtonElement>,
    value: string,
  ) => {
    if (filteredStatuses.includes(value)) {
      setFilteredStatuses(
        filteredStatuses.filter((status) => status !== value),
      );
    } else {
      setFilteredStatuses([...filteredStatuses, value]);
    }
    setIsStatusFilterOpen(false);
    refresh();
  };

  return (
    <>
      <DeleteConfirm />
      {openInviteMembers && (
        <InviteMemberModal
          orgId={orgId}
          onClose={() => {
            toggleInviteMembers();
            refresh();
          }}
        />
      )}
      {openInviteRealmUser && (
        <MemberModal
          titleKey="inviteRealmUser"
          confirmLabelKey="send"
          filterEmptyEmail
          membersQuery={() => adminClient.organizations.listMembers({ orgId })}
          onAdd={async (selectedRows) => {
            try {
              await Promise.all(
                selectedRows.map((user) => {
                  const form = new FormData();
                  form.append("id", user.id!);
                  return adminClient.organizations.inviteExistingUser(
                    { orgId },
                    form,
                  );
                }),
              );
              addAlert(
                t("organizationInvitationsSent", {
                  count: selectedRows.length,
                }),
              );
            } catch (error) {
              addError("organizationInvitationsSentError", error);
            }
          }}
          onClose={() => {
            toggleInviteRealmUser();
            refresh();
          }}
        />
      )}
      <DataTable
        t={t}
        key={key}
        loader={loader}
        isPaginated
        ariaLabelKey="invitationsList"
        onSelect={setSelectedInvitations}
        canSelectAll
        toolbarItem={
          <>
            <ToolbarItem>
              <SearchInputComponent
                value={searchText}
                onChange={setSearchText}
                onSearch={handleSearch}
                onClear={clearSearch}
                placeholder={t("searchInvitations")}
                aria-label={t("searchInvitations")}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Dropdown
                onOpenChange={setIsInviteMenuOpen}
                toggle={(ref) => (
                  <MenuToggle
                    ref={ref}
                    id="invite-member-toggle"
                    variant="primary"
                    onClick={() => setIsInviteMenuOpen(!isInviteMenuOpen)}
                    isExpanded={isInviteMenuOpen}
                  >
                    {t("inviteMember")}
                  </MenuToggle>
                )}
                isOpen={isInviteMenuOpen}
              >
                <DropdownList>
                  <DropdownItem
                    key="invite-new-user"
                    onClick={() => {
                      setIsInviteMenuOpen(false);
                      toggleInviteMembers();
                    }}
                  >
                    {t("inviteNewUser")}
                  </DropdownItem>
                  <DropdownItem
                    key="invite-realm-user"
                    onClick={() => {
                      setIsInviteMenuOpen(false);
                      toggleInviteRealmUser();
                    }}
                  >
                    {t("inviteRealmUser")}
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                variant="plain"
                isDisabled={selectedInvitations.length === 0}
                onClick={toggleDeleteDialog}
              >
                {t("deleteInvitations")}
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <CheckboxFilterComponent
                filterPlaceholderText={t("filterByStatus")}
                isOpen={isStatusFilterOpen}
                options={statusOptions}
                onOpenChange={setIsStatusFilterOpen}
                onToggleClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                onSelect={onStatusFilterSelect}
                selectedItems={filteredStatuses}
                width="200px"
              />
            </ToolbarItem>
          </>
        }
        actionResolver={(rowData) => {
          const invitation: OrganizationInvitationRepresentation = rowData.data;
          const actions = [
            {
              title: t("resendInvitation"),
              onClick: () => resendInvitation(invitation),
            },
            {
              title: t("deleteInvitation"),
              onClick: () => {
                setSelectedInvitations([invitation]);
                toggleDeleteDialog();
              },
            },
          ];

          if (invitation.inviteLink) {
            actions.splice(1, 0, {
              title: t("copyInviteLink"),
              onClick: async () => {
                try {
                  await navigator.clipboard.writeText(invitation.inviteLink!);
                  addAlert(t("inviteLinkCopied"));
                } catch (error) {
                  addError("clipboardCopyError", error);
                }
              },
            });
          }

          return actions;
        }}
        columns={[
          {
            name: "email",
            displayKey: "email",
          },
          {
            name: "firstName",
            displayKey: "firstName",
            cellRenderer: (invitation) => invitation.firstName || "-",
          },
          {
            name: "lastName",
            displayKey: "lastName",
            cellRenderer: (invitation) => invitation.lastName || "-",
          },
          {
            name: "sentDate",
            displayKey: "sentDate",
            cellRenderer: (invitation) => (
              <DateCell date={invitation.sentDate} />
            ),
          },
          {
            name: "expiresAt",
            displayKey: "expiresAt",
            cellRenderer: (invitation) => (
              <DateCell date={invitation.expiresAt} />
            ),
          },
          {
            name: "status",
            displayKey: "status",
            cellRenderer: (invitation) => (
              <InvitationStatusBadge status={invitation.status} />
            ),
          },
        ]}
        emptyState={
          <ListEmptyState
            message={t("emptyInvitations")}
            instructions={t("emptyInvitationsInstructions")}
            secondaryActions={[
              {
                text: t("inviteNewUser"),
                onClick: toggleInviteMembers,
              },
              {
                text: t("inviteRealmUser"),
                onClick: toggleInviteRealmUser,
              },
            ]}
          />
        }
        isSearching={
          searchTriggerText.length > 0 || filteredStatuses.length > 0
        }
      />
    </>
  );
};
