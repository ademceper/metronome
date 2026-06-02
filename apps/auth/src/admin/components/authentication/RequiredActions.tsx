/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/authentication/RequiredActions.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { fetchWithError } from "@keycloak/keycloak-admin-client";
import type RequiredActionProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation";
import type RequiredActionProviderSimpleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderSimpleRepresentation";
import { useAlerts, useFetch } from "../../../shared/keycloak-ui-shared";
import { Button as UIButton } from "@metronome/ui/components/button";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { Gear as CogIcon } from "@phosphor-icons/react"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../admin-client";
import { KeycloakSpinner } from "../../../shared/keycloak-ui-shared";
import { useRealm } from "../../context/realm-context/realm-context";
import { addTrailingSlash, toKey } from "../../util";
import { getAuthorizationHeaders } from "../../utils/get-authorization-headers";
import { DraggableTable } from "./components/DraggableTable";
import { RequiredActionConfigModal } from "./components/RequiredActionConfigModal";


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
const Switch = ({ id, label, labelOff, isChecked, onChange, isDisabled, ...props }: any) => (
  <span className="inline-flex items-center gap-2">
    <UISwitch id={id} checked={isChecked}
      onCheckedChange={(checked: boolean) => onChange?.(checked, undefined)}
      disabled={isDisabled} {...props} />
    {(isChecked ? label : (labelOff ?? label)) ? (
      <label htmlFor={id} className="text-sm">{isChecked ? label : (labelOff ?? label)}</label>
    ) : null}
  </span>
);

type DataType = RequiredActionProviderRepresentation &
  RequiredActionProviderSimpleRepresentation & {
    configurable?: boolean;
  };

type Row = {
  name?: string;
  enabled: boolean;
  defaultAction: boolean;
  data: DataType;
};

export const RequiredActions = () => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const [actions, setActions] = useState<Row[]>();
  const [selectedAction, setSelectedAction] = useState<DataType>();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);
  const { realm: realmName } = useRealm();

  const loadActions = async (): Promise<
    RequiredActionProviderRepresentation[]
  > => {
    const requiredActionsRequest = await fetchWithError(
      `${addTrailingSlash(
        adminClient.baseUrl,
      )}admin/realms/${realmName}/ui-ext/authentication-management/required-actions`,
      {
        method: "GET",
        headers: getAuthorizationHeaders(await adminClient.getAccessToken()),
      },
    );

    return (await requiredActionsRequest.json()) as DataType[];
  };

  useFetch(
    async () => {
      const [requiredActions, unregisteredRequiredActions] = await Promise.all([
        loadActions(),
        adminClient.authenticationManagement.getUnregisteredRequiredActions(),
      ]);
      return [
        ...requiredActions.map((action) => ({
          name: action.name!,
          enabled: action.enabled!,
          defaultAction: action.defaultAction!,
          data: action,
        })),
        ...unregisteredRequiredActions.map((action) => ({
          name: action.name!,
          enabled: false,
          defaultAction: false,
          data: action,
        })),
      ];
    },
    (actions) => setActions(actions),
    [key],
  );

  const isUnregisteredAction = (data: DataType): boolean => {
    return !("alias" in data);
  };

  const updateAction = async (
    action: DataType,
    field: "enabled" | "defaultAction",
  ) => {
    try {
      if (field in action) {
        action[field] = !action[field];
        // remove configurable property from action which only exists for the admin ui
        delete action.configurable;
        await adminClient.authenticationManagement.updateRequiredAction(
          { alias: action.alias! },
          action,
        );
      } else if (isUnregisteredAction(action)) {
        await adminClient.authenticationManagement.registerRequiredAction({
          name: action.name,
          providerId: action.providerId,
        });
      }
      refresh();
      addAlert(t("updatedRequiredActionSuccess"), AlertVariant.success);
    } catch (error) {
      addError("updatedRequiredActionError", error);
    }
  };

  const executeMove = async (
    action: RequiredActionProviderRepresentation,
    times: number,
  ) => {
    try {
      const alias = action.alias!;
      for (let index = 0; index < Math.abs(times); index++) {
        if (times > 0) {
          await adminClient.authenticationManagement.lowerRequiredActionPriority(
            {
              alias,
            },
          );
        } else {
          await adminClient.authenticationManagement.raiseRequiredActionPriority(
            {
              alias,
            },
          );
        }
      }
      refresh();

      addAlert(t("updatedRequiredActionSuccess"), AlertVariant.success);
    } catch (error) {
      addError("updatedRequiredActionError", error);
    }
  };

  if (!actions) {
    return <KeycloakSpinner />;
  }

  return (
    <>
      {selectedAction && (
        <RequiredActionConfigModal
          requiredAction={selectedAction}
          onClose={() => setSelectedAction(undefined)}
        />
      )}
      <DraggableTable
        keyField="name"
        onDragFinish={async (nameDragged, items) => {
          const keys = actions.map((e) => e.name);
          const newIndex = items.indexOf(nameDragged);
          const oldIndex = keys.indexOf(nameDragged);
          const dragged = actions[oldIndex].data;
          if (!dragged.alias) return;

          const times = newIndex - oldIndex;
          await executeMove(dragged, times);
        }}
        columns={[
          {
            name: "name",
            displayKey: "action",
            width: 50,
          },
          {
            name: "enabled",
            displayKey: "enabled",
            cellRenderer: (row) => (
              <Switch
                id={`enable-${toKey(row.name || "")}`}
                label={t("on")}
                labelOff={t("off")}
                isChecked={row.enabled}
                onChange={async () => {
                  await updateAction(row.data, "enabled");
                }}
                aria-label={row.name}
              />
            ),
            width: 20,
          },
          {
            name: "default",
            displayKey: "setAsDefaultAction",
            thTooltipText: "authDefaultActionTooltip",
            cellRenderer: (row) => (
              <Switch
                id={`default-${toKey(row.name || "")}`}
                label={t("on")}
                isDisabled={!row.enabled}
                labelOff={!row.enabled ? t("disabledOff") : t("off")}
                isChecked={row.defaultAction}
                onChange={async () => {
                  await updateAction(row.data, "defaultAction");
                }}
                aria-label={row.name}
              />
            ),
            width: 20,
          },
          {
            name: "config",
            displayKey: "configure",
            cellRenderer: (row) =>
              row.data.configurable ? (
                <Button
                  variant="plain"
                  aria-label={t("settings")}
                  onClick={() => setSelectedAction(row.data)}
                >
                  <CogIcon />
                </Button>
              ) : undefined,
            width: 10,
          },
        ]}
        data={actions}
      />
    </>
  );
};
