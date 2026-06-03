/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/sessions/SessionsTable.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type UserSessionRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userSessionRepresentation";
import { useEnvironment } from "../../../shared/keycloak-ui-shared";
import { Badge as UIBadge } from "@metronome/ui/components/badge";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
import { Stack as CubesIcon, Info as InfoCircleIcon } from "@phosphor-icons/react"
type IRowData = any;
import { ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { toClient } from "../../lib/clients";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { useConfirmDialog } from "../confirm-dialog/ConfirmDialog";
import { ListEmptyState } from "@metronome/ui/components/table/list-empty-state";
import { Action, Field, DataTable, LoaderFunction } from "@metronome/ui/components/table/data-table";
import { useRealm } from "../../context/realm-context/realm-context";
import { useWhoAmI } from "../../context/whoami/who-am-i";
import { UserRoute, toUser } from "../../lib/user";
import { toUsers } from "../../lib/user";
import { isLightweightUser } from "../user/utils";
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
const Label = ({ color, variant, icon, onClose, children, ...props }: any) => (
  <UIBadge variant="outline" {...props}>
    {icon}{children}
    {onClose ? (
      <button type="button" onClick={onClose} className="ml-1 text-xs" aria-label="close">×</button>
    ) : null}
  </UIBadge>
);
const List = ({ variant, children, className, ...props }: any) => (
  <ul className={cn("space-y-1 text-sm", variant === "inline" ? "flex flex-wrap gap-2" : "list-disc pl-5", className)} {...props}>
    {children}
  </ul>
);
const ListItem = ({ children, ...props }: any) => <li {...props}>{children}</li>;
const ListVariant = { inline: "inline" } as const;
const ToolbarItem = ({ children, className, ...props }: any) => (
  <div className={cn("flex items-center", className)} {...props}>{children}</div>
);
const Tooltip = ({ content, children, ...props }: any) => <>{children}</>;

export type ColumnName =
  | "username"
  | "start"
  | "lastAccess"
  | "clients"
  | "type";

export type SessionsTableProps = {
  loader: LoaderFunction<UserSessionRepresentation>;
  hiddenColumns?: ColumnName[];
  emptyInstructions?: string;
  logoutUser?: string;
  filter?: ReactNode;
  isSearching?: boolean;
  isPaginated?: boolean;
};

const UsernameCell = (row: UserSessionRepresentation) => {
  const { realm } = useRealm();
  const { t } = useTranslation();
  return (
    <Link to={toUser({ realm, id: row.userId!, tab: "sessions" })}>
      {row.username}
      {row.transientUser && (
        <>
          {" "}
          <Tooltip content={t("transientUserTooltip")}>
            <Label
              data-testid="user-details-label-transient-user"
              icon={<InfoCircleIcon />}
              isCompact
            >
              {t("transientUser")}
            </Label>
          </Tooltip>
        </>
      )}
    </Link>
  );
};

const ClientsCell = (row: UserSessionRepresentation) => {
  const { realm } = useRealm();
  return (
    <List variant={ListVariant.inline}>
      {Object.entries(row.clients!).map(([clientId, client]) => (
        <ListItem key={clientId}>
          <Link to={toClient({ realm, clientId, tab: "sessions" })}>
            {client}
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export default function SessionsTable({
  loader,
  hiddenColumns = [],
  emptyInstructions,
  logoutUser,
  filter,
  isSearching,
  isPaginated,
}: SessionsTableProps) {
  const { keycloak } = useEnvironment();
  const { adminClient } = useAdminClient();

  const { realm } = useRealm();
  const { whoAmI } = useWhoAmI();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addError } = useAlerts();
  const formatDate = useFormatDate();
  const [key, setKey] = useState(0);
  const refresh = () => setKey((value) => value + 1);
  const isOnUserPage = !!useMatch(UserRoute.path);

  const columns = useMemo(() => {
    const defaultColumns: Field<UserSessionRepresentation>[] = [
      {
        name: "username",
        displayKey: "user",
        cellRenderer: UsernameCell,
      },
      {
        name: "type",
        displayKey: "type",
      },
      {
        name: "start",
        displayKey: "started",
        cellRenderer: (row) => formatDate(new Date(row.start!)),
      },
      {
        name: "lastAccess",
        displayKey: "lastAccess",
        cellRenderer: (row) => formatDate(new Date(row.lastAccess!)),
      },
      {
        name: "ipAddress",
        displayKey: "ipAddress",
      },
      {
        name: "clients",
        displayKey: "clients",
        cellRenderer: ClientsCell,
      },
    ];

    return defaultColumns.filter(
      ({ name }) => !hiddenColumns.includes(name as ColumnName),
    );
  }, [realm, hiddenColumns]);

  const [toggleLogoutDialog, LogoutConfirm] = useConfirmDialog({
    titleKey: "logoutAllSessions",
    messageKey: "logoutAllDescription",
    continueButtonLabel: "confirm",
    onConfirm: async () => {
      try {
        await adminClient.users.logout({ id: logoutUser! });
        if (isOnUserPage && isLightweightUser(logoutUser)) {
          navigate(toUsers({ realm: realm }));
        } else {
          refresh();
        }
      } catch (error) {
        addError("logoutAllSessionsError", error);
      }
    },
  });

  async function onClickRevoke(rowData: IRowData) {
    const session = rowData.data as UserSessionRepresentation;
    await adminClient.realms.deleteSession({
      realm,
      session: session.id!,
      isOffline: true,
    });

    refresh();
  }

  async function onClickSignOut(rowData: IRowData) {
    const session = rowData.data as UserSessionRepresentation;
    await adminClient.realms.deleteSession({
      realm,
      session: session.id!,
      isOffline: false,
    });

    if (session.userId === whoAmI.userId) {
      await keycloak.logout({ redirectUri: "" });
    } else if (isOnUserPage && isLightweightUser(session.userId)) {
      navigate(toUsers({ realm: realm }));
    } else {
      refresh();
    }
  }

  return (
    <>
      <LogoutConfirm />
      <DataTable
        t={t}
        key={key}
        loader={loader}
        ariaLabelKey="titleSessions"
        searchPlaceholderKey="searchForSession"
        isPaginated={isPaginated}
        isSearching={isSearching}
        searchTypeComponent={filter}
        toolbarItem={
          logoutUser && (
            <ToolbarItem>
              <Button onClick={toggleLogoutDialog}>
                {t("logoutAllSessions")}
              </Button>
            </ToolbarItem>
          )
        }
        columns={columns}
        actionResolver={(rowData: IRowData) => {
          if (
            rowData.data.type === "Offline" ||
            rowData.data.type === "OFFLINE"
          ) {
            return [
              {
                title: t("revoke"),
                onClick: () => onClickRevoke(rowData),
              } as Action<UserSessionRepresentation>,
            ];
          }
          return [
            {
              title: t("signOut"),
              onClick: () => onClickSignOut(rowData),
            } as Action<UserSessionRepresentation>,
          ];
        }}
        emptyState={
          <ListEmptyState
            hasIcon
            icon={CubesIcon}
            message={t("noSessions")}
            primaryActionText={t("refresh")}
            onPrimaryAction={refresh}
            instructions={
              emptyInstructions ? emptyInstructions : t("noSessionsDescription")
            }
          />
        }
      />
    </>
  );
}
