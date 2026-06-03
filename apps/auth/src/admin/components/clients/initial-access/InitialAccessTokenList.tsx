/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/initial-access/InitialAccessTokenList.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ClientInitialAccessPresentation from "@keycloak/keycloak-admin-client/lib/defs/clientInitialAccessPresentation";
import { Button as UIButton } from "@metronome/ui/components/button";
import { cn } from "@metronome/ui/lib/utils";
const wrappable = () => ({ className: "" });
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { useConfirmDialog } from "../../confirm-dialog/ConfirmDialog";
import { ListEmptyState } from "@metronome/ui/components/list-empty-state";
import { Action, DataTable } from "@metronome/ui/components/data-table";
import { useRealm } from "../../../context/realm-context/realm-context";
import useFormatDate, { FORMAT_DATE_AND_TIME } from "../../../utils/use-format-date";
import { toCreateInitialAccessToken } from "../../../lib/clients";


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

export const InitialAccessTokenList = () => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();

  const { addAlert, addError } = useAlerts();
  const { realm } = useRealm();
  const formatDate = useFormatDate();

  const navigate = useNavigate();

  const [token, setToken] = useState<ClientInitialAccessPresentation>();

  const loader = async () => {
    try {
      return await adminClient.realms.getClientsInitialAccess({ realm });
    } catch {
      return [];
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "tokenDeleteConfirmTitle",
    messageKey: t("tokenDeleteConfirm", { id: token?.id }),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.realms.delClientsInitialAccess({
          realm,
          id: token!.id!,
        });
        addAlert(t("tokenDeleteSuccess"), AlertVariant.success);
        setToken(undefined);
      } catch (error) {
        addError("tokenDeleteError", error);
      }
    },
  });

  return (
    <>
      <DeleteConfirm />
      <DataTable
        t={t}
        key={token?.id}
        ariaLabelKey="initialAccessToken"
        searchPlaceholderKey="searchInitialAccessToken"
        loader={loader}
        toolbarItem={
          <Button
            component={(props) => (
              <Link {...props} to={toCreateInitialAccessToken({ realm })} />
            )}
          >
            {t("create")}
          </Button>
        }
        actions={[
          {
            title: t("delete"),
            onRowClick: (token) => {
              setToken(token);
              toggleDeleteDialog();
            },
          } as Action<ClientInitialAccessPresentation>,
        ]}
        columns={[
          {
            name: "id",
            displayKey: "id",
          },
          {
            name: "timestamp",
            displayKey: "timestamp",
            cellRenderer: (row) =>
              formatDate(new Date(row.timestamp! * 1000), FORMAT_DATE_AND_TIME),
          },
          {
            name: "expiration",
            displayKey: "expires",
            cellRenderer: (row) =>
              formatDate(
                new Date(row.timestamp! * 1000 + row.expiration! * 1000),
                FORMAT_DATE_AND_TIME,
              ),
          },
          {
            name: "count",
            displayKey: "count",
          },
          {
            name: "remainingCount",
            displayKey: "remainingCount",
            transforms: [wrappable],
          },
        ]}
        emptyState={
          <ListEmptyState
            message={t("noTokens")}
            instructions={t("noTokensInstructions")}
            primaryActionText={t("create")}
            onPrimaryAction={() =>
              navigate(toCreateInitialAccessToken({ realm }))
            }
          />
        }
      />
    </>
  );
};
