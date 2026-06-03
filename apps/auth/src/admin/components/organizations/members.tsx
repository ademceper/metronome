/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/Members.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { Action, DataTable } from "@metronome/ui/components/table/data-table";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { CheckboxFilterComponent } from "../dynamic/checkbox-filter-component";
import { SearchInputComponent } from "../dynamic/search-input-component";
import { useRealm } from "../../context/realm-context/realm-context";
import { MemberModal } from "../groups/members-modal";
import { toUser } from "../../lib/user";
import { translationFormatter } from "../../utils/translation-formatter";
import { useParams } from "../../utils/use-params";
import useToggle from "../../utils/use-toggle";
import { EditOrganizationParams } from "../../lib/organizations";
import { MembershipsModal } from "../groups/memberships-modal";
import { GroupResourceContext } from "../../context/group-resource/group-resource-context";


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
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);

type MembershipTypeRepresentation = UserRepresentation & {
  membershipType?: string;
};

const UserDetailLink = (user: any) => {
  const { realm } = useRealm();
  return (
    <Link to={toUser({ realm, id: user.id!, tab: "settings" })}>
      {user.username}
    </Link>
  );
};

export const Members = () => {
  const { t } = useTranslation();
  const { adminClient } = useAdminClient();
  const { id: orgId } = useParams<EditOrganizationParams>();
  const { addAlert, addError } = useAlerts();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);
  const [openAddMembers, toggleAddMembers] = useToggle();
  const [selectedMembers, setSelectedMembers] = useState<UserRepresentation[]>(
    [],
  );
  const [searchText, setSearchText] = useState<string>("");
  const [searchTriggerText, setSearchTriggerText] = useState<string>("");
  const [filteredMembershipTypes, setFilteredMembershipTypes] = useState<
    string[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showMemberships, toggleShowMemberships] = useToggle();
  const [selectedMember, setSelectedMember] = useState<UserRepresentation>();

  const membershipOptions = [
    { value: "Managed", label: "Managed" },
    { value: "Unmanaged", label: "Unmanaged" },
  ];

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (_event: any, value: string) => {
    if (filteredMembershipTypes.includes(value)) {
      setFilteredMembershipTypes(
        filteredMembershipTypes.filter((item) => item !== value),
      );
    } else {
      setFilteredMembershipTypes([...filteredMembershipTypes, value]);
    }
    setIsOpen(false);
    refresh();
  };

  const loader = async (first?: number, max?: number) => {
    try {
      const membershipType =
        filteredMembershipTypes.length === 1
          ? filteredMembershipTypes[0]
          : undefined;

      const memberships: MembershipTypeRepresentation[] =
        await adminClient.organizations.listMembers({
          orgId,
          first,
          max,
          search: searchTriggerText,
          membershipType,
        });

      return memberships;
    } catch (error) {
      addError("organizationsMembersListError", error);
      return [];
    }
  };

  const handleChange = (value: string) => {
    setSearchText(value);
  };

  const handleSearch = () => {
    setSearchTriggerText(searchText);
    refresh();
  };

  const clearInput = () => {
    setSearchText("");
    setSearchTriggerText("");
    refresh();
  };

  const removeMember = async (selectedMembers: UserRepresentation[]) => {
    try {
      await Promise.all(
        selectedMembers.map((user) =>
          adminClient.organizations.delMember({
            orgId,
            userId: user.id!,
          }),
        ),
      );
      addAlert(t("organizationUsersLeft", { count: selectedMembers.length }));
    } catch (error) {
      addError("organizationUsersLeftError", error);
    }

    refresh();
  };

  return (
    <>
      {openAddMembers && (
        <MemberModal
          membersQuery={() => adminClient.organizations.listMembers({ orgId })}
          onAdd={async (selectedRows) => {
            try {
              await Promise.all(
                selectedRows.map((user) =>
                  adminClient.organizations.addMember({
                    orgId,
                    userId: `"${user.id!}"`,
                  }),
                ),
              );
              addAlert(
                t("organizationUsersAdded", { count: selectedRows.length }),
              );
            } catch (error) {
              addError("organizationUsersAddedError", error);
            }
          }}
          onClose={() => {
            toggleAddMembers();
            refresh();
          }}
        />
      )}
      {showMemberships && (
        <GroupResourceContext value={adminClient.organizations.groups(orgId)}>
          <MembershipsModal
            onClose={() => {
              toggleShowMemberships();
            }}
            user={selectedMember!}
            orgId={orgId}
          />
        </GroupResourceContext>
      )}
      <DataTable
        t={t}
        key={key}
        loader={loader}
        isPaginated
        ariaLabelKey="membersList"
        onSelect={(members) => setSelectedMembers([...members])}
        canSelectAll
        toolbarItem={
          <>
            <ToolbarItem>
              <SearchInputComponent
                value={searchText}
                onChange={handleChange}
                onSearch={handleSearch}
                onClear={clearInput}
                placeholder={t("searchMembers")}
                aria-label={t("searchMembers")}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="primary" onClick={toggleAddMembers}>
                {t("addMember")}
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                variant="plain"
                isDisabled={selectedMembers.length === 0}
                onClick={() => removeMember(selectedMembers)}
              >
                {t("removeMember")}
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <CheckboxFilterComponent
                filterPlaceholderText={t("filterByMembershipType")}
                isOpen={isOpen}
                options={membershipOptions}
                onOpenChange={(nextOpen) => setIsOpen(nextOpen)}
                onToggleClick={onToggleClick}
                onSelect={onSelect}
                selectedItems={filteredMembershipTypes}
                width={"260px"}
              />
            </ToolbarItem>
          </>
        }
        actions={[
          {
            title: t("remove"),
            onRowClick: async (member) => {
              await removeMember([member]);
            },
          },
          {
            title: t("showGroupMemberships"),
            onRowClick: (member) => {
              setSelectedMember(member);
              toggleShowMemberships();
            },
          } as Action<UserRepresentation>,
        ]}
        columns={[
          {
            name: "username",
            cellRenderer: UserDetailLink,
          },
          {
            name: "email",
          },
          {
            name: "firstName",
          },
          {
            name: "lastName",
          },
          {
            name: "membershipType",
            cellFormatters: [translationFormatter(t)],
          },
        ]}
        emptyState={
          <ListEmptyState
            message={t("emptyMembers")}
            instructions={t("emptyMembersInstructions")}
            secondaryActions={[
              {
                text: t("addRealmUser"),
                onClick: toggleAddMembers,
              },
            ]}
          />
        }
        isSearching={
          filteredMembershipTypes.length > 0 || searchTriggerText.length > 0
        }
      />
    </>
  );
};
