/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/GroupRoleMapping.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type { RoleMappingPayload } from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { useTranslation } from "react-i18next";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { RoleMapping, Row } from "../role-mapping/RoleMapping";
import { useGroupResource } from "../../context/group-resource/group-resource-context";


const AlertVariant = {
  default: "default",
  success: "default",
  info: "default",
  warning: "default",
  danger: "destructive",
} as const;

type GroupRoleMappingProps = {
  id: string;
  name: string;
  canManageGroup: boolean;
};

export const GroupRoleMapping = ({
  id,
  name,
  canManageGroup,
}: GroupRoleMappingProps) => {
  const groups = useGroupResource();

  const { t } = useTranslation();
  const { addAlert, addError } = useAlerts();

  const assignRoles = async (rows: Row[]) => {
    try {
      const realmRoles = rows
        .filter((row) => row.client === undefined)
        .map((row) => row.role as RoleMappingPayload)
        .flat();
      await groups.addRealmRoleMappings({
        id,
        roles: realmRoles,
      });
      await Promise.all(
        rows
          .filter((row) => row.client !== undefined)
          .map((row) =>
            groups.addClientRoleMappings({
              id,
              clientUniqueId: row.client!.id!,
              roles: [row.role as RoleMappingPayload],
            }),
          ),
      );
      addAlert(t("roleMappingUpdatedSuccess"), AlertVariant.success);
    } catch (error) {
      addError("roleMappingUpdatedError", error);
    }
  };

  return (
    <RoleMapping
      isManager={canManageGroup}
      name={name}
      id={id}
      type="groups"
      save={assignRoles}
    />
  );
};
