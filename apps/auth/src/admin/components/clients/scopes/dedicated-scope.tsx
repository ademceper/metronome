/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/scopes/DedicatedScope.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import type { RoleMappingPayload } from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { Separator as UISeparator } from "@metronome/ui/components/separator";
import { Switch as UISwitch } from "@metronome/ui/components/switch";
import { cn } from "@metronome/ui/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../../../shared/keycloak-ui-shared";
import { useAdminClient } from "../../../admin-client";
import { useAlerts } from "../../../../shared/keycloak-ui-shared";
import { FormAccess } from "../../form/form-access";
import { RoleMapping, Row } from "../../role-mapping/role-mapping";
import { useAccess } from "../../../context/access/access";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;
const Divider = (props: any) => <UISeparator {...props} />;
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

type DedicatedScopeProps = {
  client: ClientRepresentation;
};

export const DedicatedScope = ({
  client: initialClient,
}: DedicatedScopeProps) => {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const [client, setClient] = useState<ClientRepresentation>(initialClient);

  const { hasAccess } = useAccess();
  const isManager = hasAccess("manage-clients") || client.access?.manage;

  const assignRoles = async (rows: Row[]) => {
    try {
      const realmRoles = rows
        .filter((row) => row.client === undefined)
        .map((row) => row.role as RoleMappingPayload)
        .flat();
      await Promise.all([
        adminClient.clients.addRealmScopeMappings(
          {
            id: client.id!,
          },
          realmRoles,
        ),
        ...rows
          .filter((row) => row.client !== undefined)
          .map((row) =>
            adminClient.clients.addClientScopeMappings(
              {
                id: client.id!,
                client: row.client!.id!,
              },
              [row.role as RoleMappingPayload],
            ),
          ),
      ]);

      addAlert(t("clientScopeSuccess"), AlertVariant.success);
    } catch (error) {
      addError("clientScopeError", error);
    }
  };

  const update = async () => {
    const newClient = { ...client, fullScopeAllowed: !client.fullScopeAllowed };
    try {
      await adminClient.clients.update({ id: client.id! }, newClient);
      addAlert(t("clientScopeSuccess"), AlertVariant.success);
      setClient(newClient);
    } catch (error) {
      addError("clientScopeError", error);
    }
  };

  return (
    <PageSection>
      <FormAccess
        role="manage-clients"
        fineGrainedAccess={client.access?.manage}
        isHorizontal
      >
        <FormGroup
          hasNoPaddingTop
          label={t("fullScopeAllowed")}
          labelIcon={
            <HelpItem
              helpText={t("fullScopeAllowedHelp")}
              fieldLabelId="fullScopeAllowed"
            />
          }
          fieldId="fullScopeAllowed"
        >
          <Switch
            id="fullScopeAllowed"
            label={t("on")}
            labelOff={t("off")}
            isChecked={client.fullScopeAllowed}
            onChange={update}
            aria-label={t("fullScopeAllowed")}
          />
        </FormGroup>
      </FormAccess>
      {!client.fullScopeAllowed && (
        <>
          <Divider />
          <RoleMapping
            name={client.clientId!}
            id={client.id!}
            type="clients"
            save={assignRoles}
            isManager={isManager}
          />
        </>
      )}
    </PageSection>
  );
};
