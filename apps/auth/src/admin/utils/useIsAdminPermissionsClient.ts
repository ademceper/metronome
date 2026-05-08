/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/utils/useIsAdminPermissionsClient.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useState, useEffect } from "react";
import { useRealm } from "../context/realm-context/RealmContext";

export function useIsAdminPermissionsClient(selectedClientId: string) {
  const { realmRepresentation } = useRealm();
  const [isAdminPermissionsClient, setIsAdminPermissionsClient] =
    useState<boolean>(false);

  useEffect(() => {
    if (realmRepresentation?.adminPermissionsClient) {
      setIsAdminPermissionsClient(
        selectedClientId === realmRepresentation.adminPermissionsClient.id,
      );
    } else {
      setIsAdminPermissionsClient(false);
    }
  }, [selectedClientId, realmRepresentation]);

  return isAdminPermissionsClient;
}
