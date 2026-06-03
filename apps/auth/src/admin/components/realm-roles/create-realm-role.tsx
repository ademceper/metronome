/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-roles/CreateRealmRole.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { AttributeForm } from "../key-value-form/attribute-form";
import { RoleForm } from "../role-form/role-form";
import { useRealm } from "../../context/realm-context/realm-context";
import { toRealmRole } from "../../lib/realm-roles";
import { toRealmRoles } from "../../lib/realm-roles";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;

export default function CreateRealmRole() {
  const { adminClient } = useAdminClient();

  const { t } = useTranslation();
  const form = useForm<AttributeForm>({ mode: "onChange" });
  const navigate = useNavigate();
  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();

  const onSubmit: SubmitHandler<AttributeForm> = async (formValues) => {
    const role: RoleRepresentation = {
      ...formValues,
      name: formValues.name?.trim(),
      attributes: {},
    };

    try {
      await adminClient.roles.create(role);

      const createdRole = await adminClient.roles.findOneByName({
        name: formValues.name!,
      });

      if (!createdRole) {
        throw new Error(t("notFound"));
      }

      addAlert(t("roleCreated"), AlertVariant.success);
      navigate(toRealmRole({ realm, id: createdRole.id!, tab: "details" }));
    } catch (error) {
      addError("roleCreateError", error);
    }
  };

  return (
    <FormProvider {...form}>
      <RoleForm
        form={form}
        onSubmit={onSubmit}
        cancelLink={toRealmRoles({ realm })}
        role="manage-realm"
        editMode={false}
      />
    </FormProvider>
  );
}
