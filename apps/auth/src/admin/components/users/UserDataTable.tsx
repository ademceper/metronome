/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/users/UserDataTable.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import * as React from "react";
import type { UserProfileConfig } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import {
  KeycloakDataTable,
  KeycloakSpinner,
  ListEmptyState,
  useAlerts,
  useFetch,
} from "../../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { WarningCircle as ExclamationCircleIcon, Info as InfoCircleIcon, Warning as WarningTriangleIcon } from "@phosphor-icons/react"
type IRowData = any;
import { JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { fetchRealmInfo } from "../../context/auth/admin-ui-endpoint";
import { UiRealmInfo } from "../../context/auth/uiRealmInfo";
import { useRealm } from "../../context/realm-context/RealmContext";
import { SearchType } from "../../user/details/SearchFilter";
import { toAddUser } from "../../user/routes/AddUser";
import { toUser } from "../../user/routes/User";
import { emptyFormatter } from "../../util";
import { useConfirmDialog } from "../confirm-dialog/ConfirmDialog";
import { BruteUser, findUsers } from "../role-mapping/resource";
import { UserDataTableToolbarItems } from "./UserDataTableToolbarItems";
import { NetworkError } from "@keycloak/keycloak-admin-client";


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
const Chip = ({ onClick, children, ...props }: any) => (
  <UIBadge variant="secondary" {...props}>
    {children}
    {onClick ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </UIBadge>
);
const ChipGroup = ({ categoryName, numChips, onClick, isClosable, children, ...props }: any) => (
  <div className="flex flex-wrap items-center gap-1" {...props}>
    {categoryName ? <span className="text-muted-foreground text-xs">{categoryName}:</span> : null}
    {children}
    {isClosable ? <button type="button" onClick={onClick} aria-label="close" className="ml-1 text-xs">×</button> : null}
  </div>
);
const EmptyState = ({ variant, titleText, headingLevel, icon, children, ...props }: any) => (
  <div className={cn("flex flex-col items-center gap-3 py-10 text-center", (props as any).className)} {...props}>
    {icon ? <div className="text-muted-foreground">{React.createElement(icon)}</div> : null}
    {titleText ? <h3 className="font-medium text-lg">{titleText}</h3> : null}
    {children}
  </div>
);
const FlexItem = ({ children, className, ...props }: any) => (
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
const Text = ({ component = "p", children, className, ...props }: any) =>
  React.createElement(component, { className: cn("text-sm", className), ...props }, children);
const TextContent = ({ children, className, ...props }: any) => (
  <div className={cn("space-y-2 text-sm", className)} {...props}>{children}</div>
);
const Toolbar = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
);
const ToolbarContent = ({ children, className, ...props }: any) => (
  <div className={cn("flex flex-wrap items-center gap-2", className)} {...props}>{children}</div>
);
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);
const Tooltip = ({ content, children, ...props }: any) => <>{children}</>;

export type UserFilter = {
  exact: boolean;
  userAttribute: UserAttribute[];
};

export type UserAttribute = {
  name: string;
  displayName: string;
  value: string;
};

const UserDetailLink = (user: BruteUser) => {
  const { t } = useTranslation();
  const { realm } = useRealm();
  return (
    <>
      <Link to={toUser({ realm, id: user.id!, tab: "settings" })}>
        {user.username}
        <StatusRow user={user} />
      </Link>
      {user.attributes?.["is_temporary_admin"]?.[0] === "true" && (
        <Tooltip content={t("temporaryAdmin")}>
          <WarningTriangleIcon
            className="pf-v5-u-ml-sm"
            id="temporary-admin-label"
          />
        </Tooltip>
      )}
    </>
  );
};

type StatusRowProps = {
  user: BruteUser;
};

const StatusRow = ({ user }: StatusRowProps) => {
  const { t } = useTranslation();
  return (
    <>
      {!user.enabled && (
        <Label color="red" icon={<InfoCircleIcon />}>
          {t("disabled")}
        </Label>
      )}
      {user.bruteForceStatus?.disabled && (
        <Label color="orange" icon={<WarningTriangleIcon />}>
          {t("temporaryLocked")}
        </Label>
      )}
    </>
  );
};

const ValidatedEmail = (user: UserRepresentation) => {
  const { t } = useTranslation();
  return (
    <>
      {!user.emailVerified && (
        <Tooltip content={t("notVerified")}>
          <ExclamationCircleIcon className="keycloak__user-section__email-verified" />
        </Tooltip>
      )}{" "}
      {emptyFormatter()(user.email) as JSX.Element}
    </>
  );
};

export function UserDataTable() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();
  const { realm: realmName, realmRepresentation: realm } = useRealm();
  const navigate = useNavigate();
  const [uiRealmInfo, setUiRealmInfo] = useState<UiRealmInfo>({});
  const [searchUser, setSearchUser] = useState("");
  const [selectedRows, setSelectedRows] = useState<UserRepresentation[]>([]);
  const [searchType, setSearchType] = useState<SearchType>("default");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<UserFilter>({
    exact: false,
    userAttribute: [],
  });
  const [profile, setProfile] = useState<UserProfileConfig>({});
  const [query, setQuery] = useState("");

  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  useFetch(
    async () => {
      try {
        return await Promise.all([
          fetchRealmInfo(adminClient),
          adminClient.users.getProfile(),
        ]);
      } catch (error) {
        if (error instanceof NetworkError && error?.response?.status === 403) {
          // "User Profile" attributes not available for Users Attribute search, when admin user does not have view- or manage-realm realm-management role
          return [{}, {}] as [UiRealmInfo, UserProfileConfig];
        } else {
          throw error;
        }
      }
    },
    ([uiRealmInfo, profile]) => {
      setUiRealmInfo(uiRealmInfo);
      setProfile(profile);
    },
    [],
  );

  const loader = async (first?: number, max?: number, search?: string) => {
    const params: { [name: string]: string | number | boolean } = {
      first: first!,
      max: max!,
      q: query!,
    };

    const searchParam = search || searchUser || "";
    if (searchParam) {
      params.search = searchParam;
    }

    if (activeFilters.exact) params.exact = true;

    if (!listUsers && !(params.search || params.q)) {
      return [];
    }

    try {
      return await findUsers(adminClient, {
        briefRepresentation: true,
        ...params,
      });
    } catch (error) {
      if (uiRealmInfo.userProfileProvidersEnabled) {
        addError("noUsersFoundErrorStorage", error);
      } else {
        addError("noUsersFoundError", error);
      }
      return [];
    }
  };

  const [toggleUnlockUsersDialog, UnlockUsersConfirm] = useConfirmDialog({
    titleKey: "unlockAllUsers",
    messageKey: "unlockUsersConfirm",
    continueButtonLabel: "unlock",
    onConfirm: async () => {
      try {
        await adminClient.attackDetection.delAll();
        refresh();
        addAlert(t("unlockUsersSuccess"), AlertVariant.success);
      } catch (error) {
        addError("unlockUsersError", error);
      }
    },
  });

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteConfirmUsers", {
      count: selectedRows.length,
      name: selectedRows[0]?.username,
    }),
    messageKey: t("deleteConfirmDialog", { count: selectedRows.length }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        for (const user of selectedRows) {
          await adminClient.users.del({ id: user.id! });
        }
        setSelectedRows([]);
        clearAllFilters();
        addAlert(t("userDeletedSuccess"), AlertVariant.success);
      } catch (error) {
        addError("userDeletedError", error);
      }
    },
  });

  const goToCreate = () => navigate(toAddUser({ realm: realmName }));

  if (uiRealmInfo.userProfileProvidersEnabled === undefined || !realm) {
    return <KeycloakSpinner />;
  }

  //should *only* list users when no user federation is configured
  const listUsers = !uiRealmInfo.userProfileProvidersEnabled;

  const clearAllFilters = () => {
    setActiveFilters({ exact: false, userAttribute: [] });
    setSearchUser("");
    setQuery("");
    refresh();
  };

  const createQueryString = (filters: UserFilter) => {
    return filters.userAttribute
      .map((filter) => `${filter.name}:${filter.value}`)
      .join(" ");
  };

  const searchUserWithAttributes = () => {
    const attributes = createQueryString(activeFilters);
    setQuery(attributes);
    refresh();
  };

  const createAttributeSearchChips = () => {
    return (
      <FlexItem>
        {activeFilters.userAttribute.length > 0 && (
          <>
            {Object.values(activeFilters.userAttribute).map((entry) => {
              return (
                <ChipGroup
                  className="pf-v5-u-mt-md pf-v5-u-mr-md"
                  data-testid="user-attribute-search-chips-group"
                  key={entry.name}
                  categoryName={
                    entry.displayName.length ? entry.displayName : entry.name
                  }
                  isClosable
                  onClick={(event) => {
                    event.stopPropagation();

                    const filtered = [...activeFilters.userAttribute].filter(
                      (chip) => chip.name !== entry.name,
                    );
                    const active = {
                      userAttribute: filtered,
                      exact: activeFilters.exact,
                    };

                    setActiveFilters(active);
                    setQuery(createQueryString(active));
                    refresh();
                  }}
                >
                  <Chip key={entry.name} isReadOnly>
                    {entry.value}
                  </Chip>
                </ChipGroup>
              );
            })}
          </>
        )}
      </FlexItem>
    );
  };

  const toolbar = () => {
    return (
      <UserDataTableToolbarItems
        searchDropdownOpen={searchDropdownOpen}
        setSearchDropdownOpen={setSearchDropdownOpen}
        realm={realm}
        hasSelectedRows={selectedRows.length === 0}
        toggleDeleteDialog={toggleDeleteDialog}
        toggleUnlockUsersDialog={toggleUnlockUsersDialog}
        goToCreate={goToCreate}
        searchType={searchType}
        setSearchType={setSearchType}
        searchUser={searchUser}
        setSearchUser={setSearchUser}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        refresh={refresh}
        profile={profile}
        clearAllFilters={clearAllFilters}
        createAttributeSearchChips={createAttributeSearchChips}
        searchUserWithAttributes={searchUserWithAttributes}
      />
    );
  };

  const subtoolbar = () => {
    if (!activeFilters.userAttribute.length) {
      return;
    }
    return (
      <div className="user-attribute-search-form-subtoolbar">
        <ToolbarItem>{createAttributeSearchChips()}</ToolbarItem>
        <ToolbarItem>
          <Button
            variant="link"
            onClick={() => {
              clearAllFilters();
            }}
          >
            {t("clearAllFilters")}
          </Button>
        </ToolbarItem>
      </div>
    );
  };

  return (
    <>
      <DeleteConfirm />
      <UnlockUsersConfirm />
      <KeycloakDataTable
        isSearching={
          searchUser !== "" || activeFilters.userAttribute.length !== 0
        }
        key={key}
        loader={loader}
        isPaginated
        ariaLabelKey="titleUsers"
        canSelectAll
        onSelect={(rows: UserRepresentation[]) => setSelectedRows([...rows])}
        emptyState={
          !listUsers ? (
            <>
              <Toolbar>
                <ToolbarContent>{toolbar()}</ToolbarContent>
              </Toolbar>
              <EmptyState data-testid="empty-state" variant="lg">
                <TextContent className="kc-search-users-text">
                  <Text>{t("searchForUserDescription")}</Text>
                </TextContent>
              </EmptyState>
            </>
          ) : (
            <ListEmptyState
              message={t("noUsersFound")}
              instructions={t("emptyInstructions")}
              primaryActionText={t("createNewUser")}
              onPrimaryAction={goToCreate}
            />
          )
        }
        toolbarItem={toolbar()}
        subToolbar={subtoolbar()}
        actionResolver={(rowData: IRowData) => [
          {
            title: t("delete"),
            onClick: () => {
              setSelectedRows([rowData.data]);
              toggleDeleteDialog();
            },
          },
        ]}
        isRowDisabled={(user: UserRepresentation) => !user.access?.manage}
        columns={[
          {
            name: "username",
            displayKey: "username",
            cellRenderer: UserDetailLink,
          },
          {
            name: "email",
            displayKey: "email",
            cellRenderer: ValidatedEmail,
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
    </>
  );
}
