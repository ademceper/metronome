/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/utils/useCurrentUser.ts" --revert
 */

/* eslint-disable */

// @ts-nocheck

import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { useFetch } from "../../shared/keycloak-ui-shared";
import { useState } from "react";
import { useAdminClient } from "../admin-client";
import { useWhoAmI } from "../context/whoami/who-am-i";

export function useCurrentUser() {
  const { adminClient } = useAdminClient();
  const { whoAmI } = useWhoAmI();
  const [currentUser, setCurrentUser] = useState<UserRepresentation>();

  useFetch(
    () => adminClient.users.findOne({ id: whoAmI.userId }),
    setCurrentUser,
    [whoAmI.userId],
  );

  return { ...currentUser, realm: whoAmI.realm };
}
