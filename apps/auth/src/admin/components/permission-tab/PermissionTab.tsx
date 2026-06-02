/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/permission-tab/PermissionTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { ManagementPermissionReference } from "@keycloak/keycloak-admin-client/lib/defs/managementPermissionReference";
import { HelpItem, useFetch } from "../../../shared/keycloak-ui-shared";
import { Card as UICard, CardContent as UICardContent, CardTitle as UICardTitle } from "@metronome/ui/components/card";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import {
  Table,
  TableBody as Tbody,
  TableCell as Td,
  TableHead as Th,
  TableHeader as Thead,
  TableRow as Tr,
} from "@metronome/ui/components/table";
const ActionsColumn = ({ items, extraData: _e }: any) => null;
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { toPermissionDetails } from "../../lib/clients";
import { KeycloakSpinner } from "../../../shared/keycloak-ui-shared";
import { useRealm } from "../../context/realm-context/realm-context";
import useLocaleSort from "../../utils/use-locale-sort";
import { useConfirmDialog } from "../confirm-dialog/ConfirmDialog";

const Card = ({ isSelectable, isSelected, isFlat, isCompact, ...props }: any) => (
  <UICard {...props} />
);
const CardBody = (props: any) => <UICardContent {...props} />;
const CardTitle = (props: any) => <UICardTitle {...props} />;
const Form = ({ onSubmit, isHorizontal, children, ...props }: any) => (
  <form onSubmit={onSubmit} className={cn("space-y-4", (props as any).className)} {...props}>{children}</form>
);
const FormGroup = ({ label, fieldId, isRequired, labelIcon, helperText, helperTextInvalid, validated, children, ...props }: any) => (
  <div className={cn("space-y-1.5", (props as any).className)}>
    {label ? (
      <label htmlFor={fieldId} className="font-medium text-sm">
        {label}
        {isRequired ? <span className="text-destructive"> *</span> : null}
        {labelIcon}
      </label>
    ) : null}
    {children}
    {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
    {helperTextInvalid ? <p className="text-destructive text-xs">{helperTextInvalid}</p> : null}
  </div>
);
const PageSection = ({ variant, isFilled, hasOverflowScroll, padding, className, children, ...props }: any) => (
  <section className={cn("px-4 py-3",
    variant === "light" && "bg-card",
    isFilled && "flex-1",
    hasOverflowScroll && "overflow-auto",
    className)} {...props}>{children}</section>
);
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

type PermissionScreenType =
  | "clients"
  | "users"
  | "groups"
  | "roles"
  | "identityProviders";

type PermissionsTabProps = {
  id?: string;
  type: PermissionScreenType;
};

export const PermissionsTab = ({ id, type }: PermissionsTabProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { realm } = useRealm();
  const [realmId, setRealmId] = useState("");
  const [permission, setPermission] = useState<ManagementPermissionReference>();
  const localeSort = useLocaleSort();

  const togglePermissionEnabled = (enabled: boolean) => {
    switch (type) {
      case "clients":
        return adminClient.clients.updateFineGrainPermission(
          { id: id! },
          { enabled },
        );
      case "users":
        return adminClient.realms.updateUsersManagementPermissions({
          realm,
          enabled,
        });
      case "groups":
        return adminClient.groups.updatePermission({ id: id! }, { enabled });
      case "roles":
        return adminClient.roles.updatePermission({ id: id! }, { enabled });
      case "identityProviders":
        return adminClient.identityProviders.updatePermission(
          { alias: id! },
          { enabled },
        );
    }
  };

  useFetch(
    () =>
      Promise.all([
        adminClient.clients.find({
          search: true,
          clientId: realm === "master" ? "master-realm" : "realm-management",
        }),
        (() => {
          switch (type) {
            case "clients":
              return adminClient.clients.listFineGrainPermissions({ id: id! });
            case "users":
              return adminClient.realms.getUsersManagementPermissions({
                realm,
              });
            case "groups":
              return adminClient.groups.listPermissions({ id: id! });
            case "roles":
              return adminClient.roles.listPermissions({ id: id! });
            case "identityProviders":
              return adminClient.identityProviders.listPermissions({
                alias: id!,
              });
          }
        })(),
      ]),
    ([clients, permission]) => {
      setRealmId(clients[0]?.id!);
      setPermission(permission);
    },
    [id],
  );

  const [toggleDisableDialog, DisableConfirm] = useConfirmDialog({
    titleKey: "permissionsDisable",
    messageKey: "permissionsDisableConfirm",
    continueButtonLabel: "confirm",
    onConfirm: async () => {
      const permission = await togglePermissionEnabled(false);
      setPermission(permission);
    },
  });

  if (!permission) {
    return <KeycloakSpinner />;
  }

  return (
    <PageSection variant="light">
      <DisableConfirm />
      <Card isFlat>
        <CardTitle>{t("permissions")}</CardTitle>
        <CardBody>
          {t(`${type}PermissionsHint`)}
          <Form isHorizontal className="pf-v5-u-pt-md">
            <FormGroup
              hasNoPaddingTop
              className="permission-label"
              label={t("permissionsEnabled")}
              fieldId="permissionsEnabled"
              labelIcon={
                <HelpItem
                  helpText={t("permissionsEnabledHelp")}
                  fieldLabelId="permissionsEnabled"
                />
              }
            >
              <Switch
                id="permissionsEnabled"
                data-testid="permissionSwitch"
                label={t("on")}
                labelOff={t("off")}
                isChecked={permission.enabled}
                onChange={async (_event, enabled) => {
                  if (enabled) {
                    const permission = await togglePermissionEnabled(enabled);
                    setPermission(permission);
                  } else {
                    toggleDisableDialog();
                  }
                }}
                aria-label={t("permissionsEnabled")}
              />
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
      {permission.enabled && (
        <>
          <Card isFlat className="pf-v5-u-mt-lg">
            <CardTitle>{t("permissionsList")}</CardTitle>
            <CardBody>
              <Trans i18nKey="permissionsListIntro">
                {" "}
                <strong>
                  {{
                    realm:
                      realm === "master" ? "master-realm" : "realm-management",
                  }}
                </strong>
                .
              </Trans>
            </CardBody>
          </Card>
          <Card isFlat className="keycloak__permission__permission-table">
            <CardBody className="pf-v5-u-p-0">
              <Table aria-label={t("permissionsList")} variant="compact">
                <Thead>
                  <Tr>
                    <Th id="permissionsScopeName">
                      {t("permissionsScopeName")}
                    </Th>
                    <Th id="description">{t("description")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {localeSort(
                    Object.entries(permission.scopePermissions || {}),
                    ([name]) => name,
                  ).map(([name, id]) => (
                    <Tr key={id}>
                      <Td>
                        <Link
                          to={toPermissionDetails({
                            realm,
                            id: realmId,
                            permissionType: "scope",
                            permissionId: id,
                          })}
                        >
                          {name}
                        </Link>
                      </Td>
                      <Td>
                        {t(`scopePermissions.${type}.${name}-description`)}
                      </Td>
                      <Td isActionCell>
                        <ActionsColumn
                          items={[
                            {
                              title: t("edit"),
                              onClick() {
                                navigate(
                                  toPermissionDetails({
                                    realm,
                                    id: realmId,
                                    permissionType: "scope",
                                    permissionId: id,
                                  }),
                                );
                              },
                            },
                          ]}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </>
      )}
    </PageSection>
  );
};
